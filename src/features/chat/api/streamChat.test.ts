import { afterEach, describe, expect, it, vi } from 'vitest';
import { PORTFOLIO_CHAT_HISTORY } from '../../portfolio/chat/portfolioChatHistory';
import { buildMessages } from '../conversation/history';
import type { ChatMessage, ChatTurn } from '../conversation/messages';
import { INCOMPLETE_MESSAGE, RATE_LIMITED_MESSAGE, streamChat } from './client';
import { SSE_COMPLETED, sseDelta, sseFailed, sseResponse, stubFetch } from './streamFixtures';

const TURNS: ChatTurn[] = [
  { id: 1, role: 'user', text: 'Where is he based?' },
  { id: 2, role: 'assistant', text: 'Groningen.' },
];

interface StreamOutcome {
  deltas: string[];
  error: Error | undefined;
}

async function readStream(response: Response): Promise<StreamOutcome> {
  stubFetch(async () => response);
  return runStream();
}

async function runStream(messages: ChatMessage[] = []): Promise<StreamOutcome> {
  const deltas: string[] = [];
  const error = await streamChat(messages, { onDelta: (delta) => deltas.push(delta) }).then(
    () => undefined,
    (thrown: Error) => thrown,
  );
  return { deltas, error };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('streamChat request body', () => {
  it('sends the conversation as input with stream true and no messages key', async () => {
    const history = buildMessages(PORTFOLIO_CHAT_HISTORY, TURNS, 'What did he build?');
    const calls = stubFetch(async () => sseResponse([sseDelta('Plenty.'), SSE_COMPLETED]));

    await streamChat(history);

    expect(calls).toHaveLength(1);
    expect(calls[0].body.input).toEqual(history);
    expect(calls[0].body.stream).toBe(true);
    expect(calls[0].body).not.toHaveProperty('messages');
    expect(calls[0].headers).toEqual({ 'Content-Type': 'application/json', Accept: 'text/event-stream' });
  });
});

describe('streamChat request target', () => {
  it.each([{ url: 'https://backend.example.com/cv' }, { url: 'http://localhost:8081/cv' }])(
    'posts to exactly $url and nowhere else',
    async ({ url }) => {
      vi.stubEnv('VITE_AGENT_URL', url);
      vi.resetModules();
      const calls = stubFetch(async () => sseResponse([SSE_COMPLETED]));
      const { streamChat: freshStreamChat } = await import('./client');

      await freshStreamChat([]);

      expect(calls.map((call) => call.url)).toEqual([url]);
    },
  );
});

describe('streamChat event payloads', () => {
  it.each([
    { name: 'ignores a delta whose data is not JSON', chunks: ['event: response.output_text.delta\ndata: {\n\n'] },
    { name: 'ignores a numeric delta', chunks: ['event: response.output_text.delta\ndata: {"delta":3}\n\n'] },
    { name: 'ignores an object delta', chunks: ['event: response.output_text.delta\ndata: {"delta":{"a":1}}\n\n'] },
    { name: 'ignores an absent delta', chunks: ['event: response.output_text.delta\ndata: {"other":"x"}\n\n'] },
    { name: 'ignores an unknown event name', chunks: ['event: response.in_progress\ndata: {"delta":"No"}\n\n'] },
    { name: 'ignores a record with no event line', chunks: ['data: {"delta":"No"}\n\n'] },
  ])('$name', async ({ chunks }) => {
    const { deltas, error } = await readStream(sseResponse([...chunks, SSE_COMPLETED]));

    expect(deltas).toEqual([]);
    expect(error).toBeUndefined();
  });

  it.each([
    {
      name: 'reads only delta from a payload carrying extra keys',
      chunks: ['event: response.output_text.delta\ndata: {"delta":"Hi","item_id":"x","sequence_number":7}\n\n'],
      deltas: ['Hi'],
    },
    {
      name: 'keeps reading valid deltas after an ignored record',
      chunks: ['event: response.created\ndata: {"delta":"No"}\n\n', 'data: {"delta":"No"}\n\n', sseDelta('After')],
      deltas: ['After'],
    },
  ])('$name', async ({ chunks, deltas: expected }) => {
    const { deltas, error } = await readStream(sseResponse([...chunks, SSE_COMPLETED]));

    expect(deltas).toEqual(expected);
    expect(error).toBeUndefined();
  });

  it.each([
    { name: 'data is not JSON', completed: 'event: response.completed\ndata: {\n\n' },
    { name: 'data is an unexpected shape', completed: 'event: response.completed\ndata: [1,2,3]\n\n' },
    { name: 'there is no data at all', completed: 'event: response.completed\n\n' },
  ])('completes the stream when $name', async ({ completed }) => {
    const { deltas, error } = await readStream(sseResponse([sseDelta('Hi'), completed]));

    expect(deltas).toEqual(['Hi']);
    expect(error).toBeUndefined();
  });
});

describe('streamChat failure event', () => {
  it.each([
    {
      name: 'rejects with the provider message',
      failure: sseFailed('Upstream exploded'),
      message: 'Upstream exploded',
    },
    {
      name: 'falls back to inference failed when the payload is unusable',
      failure: 'event: response.failed\ndata: {"response":{}}\n\n',
      message: 'inference failed',
    },
  ])('$name', async ({ failure, message }) => {
    const { deltas, error } = await readStream(sseResponse([sseDelta('Partial'), failure, sseDelta('Never')]));

    expect(deltas).toEqual(['Partial']);
    expect(error?.message).toBe(message);
  });
});

describe('streamChat http boundary', () => {
  it.each([
    { name: 'a 500', response: () => sseResponse([sseDelta('Hi')], 500), message: 'chat request failed (500)' },
    {
      name: 'a 200 with no body',
      response: () => new Response(null, { status: 200 }),
      message: 'chat request failed (200)',
    },
    {
      name: 'a 429',
      response: () => new Response('Too Many Requests', { status: 429 }),
      message: RATE_LIMITED_MESSAGE,
    },
  ])('rejects $name', async ({ response, message }) => {
    const { deltas, error } = await readStream(response());

    expect(deltas).toEqual([]);
    expect(error?.message).toBe(message);
  });

  it('never reads the body of a failed response', async () => {
    const response = sseResponse([sseDelta('Hi'), SSE_COMPLETED], 500);

    const { error } = await readStream(response);

    expect(error?.message).toBe('chat request failed (500)');
    expect(response.body?.locked).toBe(false);
  });

  it('propagates the TypeError a browser reports for a blocked cross-origin response', async () => {
    stubFetch(() => Promise.reject(new TypeError('Failed to fetch')));

    const { error } = await runStream();

    expect(error).toBeInstanceOf(TypeError);
    expect(error?.message).toBe('Failed to fetch');
  });
});

describe('streamChat completion', () => {
  it.each([
    {
      name: 'rejects when the stream ends without response.completed',
      chunks: [sseDelta('One '), sseDelta('two')],
      message: INCOMPLETE_MESSAGE,
    },
    {
      name: 'resolves when the same deltas are followed by response.completed',
      chunks: [sseDelta('One '), sseDelta('two'), SSE_COMPLETED],
      message: undefined,
    },
  ])('$name', async ({ chunks, message }) => {
    const { deltas, error } = await readStream(sseResponse(chunks));

    expect(deltas).toEqual(['One ', 'two']);
    expect(error?.message).toBe(message);
  });

  it.each([
    {
      name: 'a 200 carrying a single JSON object instead of SSE records',
      chunks: ['{"id":"resp_1","output":[{"content":[{"text":"Hello"}]}]}'],
      deltas: [],
    },
    {
      name: 'a stream that stops mid-record',
      chunks: [sseDelta('One'), 'event: response.output_text.delta\ndata: {"del'],
      deltas: ['One'],
    },
  ])('rejects $name', async ({ chunks, deltas: expected }) => {
    const { deltas, error } = await readStream(sseResponse(chunks));

    expect(deltas).toEqual(expected);
    expect(error?.message).toBe(INCOMPLETE_MESSAGE);
  });
});

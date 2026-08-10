import { afterEach, describe, expect, it, vi } from 'vitest';
import { INCOMPLETE_MESSAGE, RATE_LIMITED_MESSAGE, streamChat } from './client';
import { SSE_COMPLETED, sseDelta, sseResponse, stubFetch } from './streamFixtures';

const INFERENCE_FAILED = 'inference failed';

interface StreamOutcome {
  deltas: string[];
  error: Error | undefined;
}

async function readStream(chunks: readonly string[]): Promise<StreamOutcome> {
  stubFetch(async () => sseResponse(chunks));
  const deltas: string[] = [];
  const error = await streamChat([], { onDelta: (delta) => deltas.push(delta) }).then(
    () => undefined,
    (thrown: Error) => thrown,
  );
  return { deltas, error };
}

// `pull` fires when the stream fills its queue, not when a consumer reads, so it
// cannot witness a read. Bytes leave a ReadableStream only through a reader, and
// every way of getting one locks the stream — so an unlocked body still holding
// all of its bytes is the proof that nothing read it.
async function drain(body: ReadableStream<Uint8Array> | null): Promise<string> {
  return body ? await new Response(body).text() : '';
}

/** A 200 whose chunk boundaries fall wherever the caller puts them, mid-character included. */
function byteChunks(chunks: readonly Uint8Array[]): Response {
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(chunk);
      controller.close();
    },
  });
  return new Response(stream, { status: 200 });
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('streamChat against a stream that never completes', () => {
  it.each([
    {
      name: 'response.incomplete, which is what an exhausted max_output_tokens sends',
      chunks: [sseDelta('Half an ans'), 'event: response.incomplete\ndata: {"response":{"status":"incomplete"}}\n\n'],
      deltas: ['Half an ans'],
    },
    {
      name: 'response.incomplete carrying no text at all',
      chunks: ['event: response.incomplete\ndata: {"response":{"status":"incomplete"}}\n\n'],
      deltas: [],
    },
    { name: 'a body of nothing but blank lines', chunks: ['\n\n\n\n\r\n\r\n'], deltas: [] },
    { name: 'an empty body', chunks: [], deltas: [] },
  ])('rejects on $name', async ({ chunks, deltas: expected }) => {
    const { deltas, error } = await readStream(chunks);

    expect(deltas).toEqual(expected);
    expect(error?.message).toBe(INCOMPLETE_MESSAGE);
  });
});

describe('streamChat against well-typed but wrong payloads', () => {
  it.each([
    { name: 'a data line whose JSON is an array', data: '[{"delta":"No"}]' },
    { name: 'a data line whose JSON is null', data: 'null' },
    { name: 'a delta that is present but null', data: '{"delta":null}' },
    { name: 'a delta that is a boolean', data: '{"delta":true}' },
    { name: 'a delta that is an array of strings', data: '{"delta":["No"]}' },
    { name: 'a data line that is the bare word undefined', data: 'undefined' },
  ])('emits nothing for $name', async ({ data }) => {
    const { deltas, error } = await readStream([`event: response.output_text.delta\ndata: ${data}\n\n`, SSE_COMPLETED]);

    expect(deltas).toEqual([]);
    expect(error).toBeUndefined();
  });

  it('falls back to inference failed for deeply nested junk under response.error', async () => {
    const junk = '{"response":{"error":{"message":{"text":{"value":"deep"}},"code":"x"}}}';

    const { error } = await readStream([`event: response.failed\ndata: ${junk}\n\n`]);

    expect(error?.message).toBe(INFERENCE_FAILED);
  });

  it('falls back to inference failed when response.error is an array', async () => {
    const junk = '{"response":{"error":[{"message":"deep"}]}}';

    const { error } = await readStream([`event: response.failed\ndata: ${junk}\n\n`]);

    expect(error?.message).toBe(INFERENCE_FAILED);
  });
});

describe('streamChat against malformed SSE framing', () => {
  it('takes the last event name when a record carries two event lines', async () => {
    const record = 'event: response.output_text.delta\nevent: response.created\ndata: {"delta":"No"}\n\n';

    const { deltas, error } = await readStream([record, sseDelta('Yes'), SSE_COMPLETED]);

    expect(deltas).toEqual(['Yes']);
    expect(error).toBeUndefined();
  });

  it('ignores a delta record that has an event line and no data line', async () => {
    const { deltas, error } = await readStream(['event: response.output_text.delta\n\n', SSE_COMPLETED]);

    expect(deltas).toEqual([]);
    expect(error).toBeUndefined();
  });

  // A failure record carrying no usable payload is still a failure. Dispatching
  // on the payload instead of the event name swallows it, and the last of these
  // is how that shows up to a visitor: an error rendered as a finished answer.
  it('rejects with inference failed when response.failed carries no data line', async () => {
    const { error } = await readStream(['event: response.failed\n\n', sseDelta('Never')]);

    expect(error?.message).toBe(INFERENCE_FAILED);
  });

  it('rejects when response.failed carries an empty data line', async () => {
    const { error } = await readStream([sseDelta('Partial'), 'event: response.failed\ndata:\n\n', SSE_COMPLETED]);

    expect(error?.message).toBe(INFERENCE_FAILED);
  });

  it('keeps the streamed text and rejects when a payloadless failure precedes a completion', async () => {
    const { deltas, error } = await readStream([sseDelta('Partial'), 'event: response.failed\n\n', SSE_COMPLETED]);

    expect(deltas).toEqual(['Partial']);
    expect(error?.message).toBe(INFERENCE_FAILED);
  });

  // Last event line wins, as the SSE algorithm specifies. The consequence here is
  // that a record carrying a failure payload is read as a completion.
  it('lets a second event line turn a failure into a completion', async () => {
    const record =
      'event: response.failed\nevent: response.completed\ndata: {"response":{"error":{"message":"Boom"}}}\n\n';

    const { error } = await readStream([record]);

    expect(error).toBeUndefined();
  });
});

describe('streamChat against a completion that is not last', () => {
  it('appends text that arrives after response.completed and still resolves', async () => {
    const { deltas, error } = await readStream([SSE_COMPLETED, sseDelta('After the end')]);

    expect(deltas).toEqual(['After the end']);
    expect(error).toBeUndefined();
  });

  it('still rejects when a failure follows a completion', async () => {
    const { error } = await readStream([SSE_COMPLETED, 'event: response.failed\ndata: {"response":{}}\n\n']);

    expect(error?.message).toBe(INFERENCE_FAILED);
  });
});

describe('streamChat decoding and field selection', () => {
  it('ignores every SSE field name other than event and data', async () => {
    const record =
      'id: 42\nretry: 3000\n: a comment\nevent: response.output_text.delta\nfoo: bar\ndata: {"delta":"Kept"}\n\n';

    const { deltas, error } = await readStream([record, SSE_COMPLETED]);

    expect(deltas).toEqual(['Kept']);
    expect(error).toBeUndefined();
  });

  it('decodes a multi-byte character split across two network chunks', async () => {
    const encoder = new TextEncoder();
    const record = encoder.encode(sseDelta('héllo 🌍'));
    const split = record.length - encoder.encode('🌍"}\n\n').length + 2;

    stubFetch(async () => byteChunks([record.slice(0, split), record.slice(split)]));
    const deltas: string[] = [];
    await streamChat([], { onDelta: (delta) => deltas.push(delta) }).catch(() => undefined);

    expect(deltas).toEqual(['héllo 🌍']);
  });

  it('forwards the AbortSignal it is given to fetch', async () => {
    const controller = new AbortController();
    let seen: AbortSignal | undefined;
    vi.stubGlobal('fetch', (_url: string, init: RequestInit) => {
      seen = init.signal ?? undefined;
      return Promise.resolve(sseResponse([SSE_COMPLETED]));
    });

    await streamChat([], { signal: controller.signal });

    expect(seen).toBe(controller.signal);
  });
});

describe('streamChat reads no byte of a body it rejects', () => {
  it.each([
    { name: 'a 429', status: 429, message: RATE_LIMITED_MESSAGE },
    { name: 'a 500', status: 500, message: 'chat request failed (500)' },
  ])('never reads the body of $name', async ({ status, message }) => {
    const body = `${sseDelta('leaked')}${SSE_COMPLETED}`;
    const response = sseResponse([body], status);
    stubFetch(async () => response);

    const deltas: string[] = [];
    const error = await streamChat([], { onDelta: (delta) => deltas.push(delta) }).then(
      () => undefined,
      (thrown: Error) => thrown,
    );

    expect(error?.message).toBe(message);
    expect(deltas).toEqual([]);
    expect(response.body?.locked).toBe(false);
    expect(await drain(response.body)).toBe(body);
  });
});

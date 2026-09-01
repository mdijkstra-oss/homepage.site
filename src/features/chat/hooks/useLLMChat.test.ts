// @vitest-environment jsdom
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { INCOMPLETE_MESSAGE, RATE_LIMITED_MESSAGE } from '../api/client';
import { openSseResponse, SSE_COMPLETED, sseDelta, sseResponse, stubFetch } from '../api/streamFixtures';
import type { ChatMessage, ChatTurn } from '../conversation/messages';
import { useLLMChat } from './useLLMChat';

const INITIAL: readonly ChatMessage[] = [{ type: 'message', role: 'assistant', content: 'Portfolio context' }];

function renderChat() {
  return renderHook(() => useLLMChat(INITIAL)).result;
}

function assistantText(turns: readonly ChatTurn[]): string | undefined {
  const spoken = turns.filter((turn) => turn.role === 'assistant');
  return spoken[spoken.length - 1]?.text;
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('useLLMChat rendering a rejection', () => {
  it.each([
    {
      name: 'a generic failure',
      respond: () => sseResponse([], 500),
      text: '_Something went wrong: chat request failed (500)_',
    },
    {
      name: 'a rate-limited backend',
      respond: () => new Response('Too Many Requests', { status: 429 }),
      text: `_Something went wrong: ${RATE_LIMITED_MESSAGE}_`,
    },
    {
      name: 'a blocked cross-origin response',
      respond: () => Promise.reject(new TypeError('Failed to fetch')),
      text: '_Something went wrong: Failed to fetch_',
    },
    {
      name: 'a stream cut off after two deltas',
      respond: () => sseResponse([sseDelta('One '), sseDelta('two')]),
      text: `One two\n\n_Something went wrong: ${INCOMPLETE_MESSAGE}_`,
    },
  ])('renders $name and unlocks the composer', async ({ respond, text }) => {
    stubFetch(async () => respond());
    const chat = renderChat();

    await act(async () => {
      await chat.current.sendMessage('Question');
    });

    expect(assistantText(chat.current.messages)).toBe(text);
    expect(chat.current.isGeneratingResponse).toBe(false);
  });

  it('appends no marker when the stream completes', async () => {
    stubFetch(async () => sseResponse([sseDelta('One '), sseDelta('two'), SSE_COMPLETED]));
    const chat = renderChat();

    await act(async () => {
      await chat.current.sendMessage('Question');
    });

    expect(assistantText(chat.current.messages)).toBe('One two');
    expect(chat.current.isGeneratingResponse).toBe(false);
  });
});

describe('useLLMChat request contents', () => {
  it('never sends the empty assistant turn it inserts as a streaming target', async () => {
    const calls = stubFetch(async () => sseResponse([sseDelta('Answer'), SSE_COMPLETED]));
    const chat = renderChat();

    await act(async () => {
      await chat.current.sendMessage('First');
    });
    await act(async () => {
      await chat.current.sendMessage('Second');
    });

    expect(calls[1].body.input).toEqual([
      ...INITIAL,
      { type: 'message', role: 'user', content: 'First' },
      { type: 'message', role: 'assistant', content: 'Answer' },
      { type: 'message', role: 'user', content: 'Second' },
    ]);
  });
});

describe('useLLMChat composer lock', () => {
  it.each([
    { name: 'a stream that completes', tail: SSE_COMPLETED },
    { name: 'a stream that is cut off', tail: '' },
  ])('ignores a second send while one is in flight, and unlocks after $name', async ({ tail }) => {
    const open = openSseResponse();
    const queued = [open.response, sseResponse([SSE_COMPLETED])];
    const calls = stubFetch(async () => queued.shift() as Response);
    const chat = renderChat();

    let inFlight!: Promise<void>;
    act(() => {
      inFlight = chat.current.sendMessage('First');
    });
    expect(chat.current.isGeneratingResponse).toBe(true);

    await act(async () => {
      await chat.current.sendMessage('Second');
    });
    expect(calls).toHaveLength(1);

    await act(async () => {
      if (tail) open.push(tail);
      open.close();
      await inFlight;
    });
    expect(chat.current.isGeneratingResponse).toBe(false);

    await act(async () => {
      await chat.current.sendMessage('Third');
    });
    expect(calls).toHaveLength(2);
  });
});

describe('useLLMChat error triggers', () => {
  // The trigger is captured rather than run: letting it fire would throw into the
  // test runner, which is exactly what it is for and exactly what would fail CI.
  function captureScheduled() {
    const scheduled: Array<() => void> = [];
    vi.spyOn(globalThis, 'setTimeout').mockImplementation(((fn: () => void) => {
      scheduled.push(fn);
      return 0;
    }) as unknown as typeof setTimeout);
    return scheduled;
  }

  it.each(['/throw', '/reject', '/THROW'])('%s never reaches the backend', async (phrase) => {
    const scheduled = captureScheduled();
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    const result = renderChat();

    await act(async () => {
      await result.current.sendMessage(phrase);
    });

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(scheduled).toHaveLength(1);
    expect(assistantText(result.current.messages)).toContain('Better Stack');
    expect(result.current.isGeneratingResponse).toBe(false);
  });

  it('throws when the scheduled trigger runs', async () => {
    const scheduled = captureScheduled();
    vi.stubGlobal('fetch', vi.fn());
    const result = renderChat();

    await act(async () => {
      await result.current.sendMessage('/throw');
    });

    expect(() => scheduled[0]()).toThrow(/Deliberate test error/);
  });

  it('leaves an ordinary question alone', async () => {
    stubFetch(() => sseResponse([sseDelta('hello'), SSE_COMPLETED]));
    const result = renderChat();

    await act(async () => {
      await result.current.sendMessage('what did he build?');
    });

    expect(assistantText(result.current.messages)).toBe('hello');
  });
});

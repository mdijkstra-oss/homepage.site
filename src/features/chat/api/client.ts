import { parseJson } from '../../../lib/json';
import type { ChatMessage, StreamHandlers } from '../conversation/messages';
import { getFailedResponseEvent, getTextDeltaEvent } from './events';

const AGENT_URL = import.meta.env.VITE_AGENT_URL;
const RATE_LIMITED_STATUS = 429;
export const RATE_LIMITED_MESSAGE = 'the assistant is busy right now, try again shortly';
export const INCOMPLETE_MESSAGE = 'the answer was cut off before it finished';
const COMPLETED_EVENT = 'response.completed';

export async function streamChat(messages: ChatMessage[], { onDelta, signal }: StreamHandlers = {}) {
  const res = await fetch(AGENT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
    body: JSON.stringify({ input: messages, stream: true }),
    signal,
  });
  if (res.status === RATE_LIMITED_STATUS) {
    throw new Error(RATE_LIMITED_MESSAGE);
  }
  if (!res.ok || !res.body) {
    throw new Error(`chat request failed (${res.status})`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  const streamState = createEventStreamState();

  while (true) {
    const { done, value } = await reader.read();
    const chunk = done ? decoder.decode() : decoder.decode(value, { stream: true });
    const error = readEventStreamChunk(streamState, chunk, done, onDelta);
    if (error) throw error;
    if (done) break;
  }

  if (!streamState.completed) {
    throw new Error(INCOMPLETE_MESSAGE);
  }
}

export interface EventStreamState {
  buffer: string;
  event: string;
  data: string[];
  completed: boolean;
}

export function createEventStreamState(): EventStreamState {
  return { buffer: '', event: '', data: [], completed: false };
}

export function readEventStreamChunk(
  state: EventStreamState,
  chunk: string,
  isFinal: boolean,
  onDelta?: (chunk: string) => void,
): Error | undefined {
  const lines = `${state.buffer}${chunk}`.split('\n');
  state.buffer = isFinal ? '' : (lines.pop() ?? '');

  for (const rawLine of lines) {
    const error = readEventStreamLine(state, rawLine.endsWith('\r') ? rawLine.slice(0, -1) : rawLine, onDelta);
    if (error) return error;
  }

  return isFinal ? dispatchEventStreamRecord(state, onDelta) : undefined;
}

function readEventStreamLine(
  state: EventStreamState,
  line: string,
  onDelta?: (chunk: string) => void,
): Error | undefined {
  if (line === '') return dispatchEventStreamRecord(state, onDelta);
  if (line.startsWith('event:')) {
    state.event = line.slice(6).trim();
  } else if (line.startsWith('data:')) {
    state.data.push(line.slice(5).trim());
  }
}

function dispatchEventStreamRecord(state: EventStreamState, onDelta?: (chunk: string) => void): Error | undefined {
  const event = state.event;
  const data = state.data.join('\n');
  state.event = '';
  state.data = [];
  state.completed ||= event === COMPLETED_EVENT;
  // On the name, not the payload: a `response.failed` carrying no usable data is
  // still a failure, and gating on data is what would swallow it.
  return event ? readStreamEvent(event, data, onDelta) : undefined;
}

export function readStreamEvent(event: string, data: string, onDelta?: (chunk: string) => void): Error | undefined {
  if (event === 'response.output_text.delta') {
    const payload = getTextDeltaEvent(parseJson(data, 'chat delta SSE payload'));
    if (payload) onDelta?.(payload.delta);
  }
  if (event === 'response.failed') {
    const payload = getFailedResponseEvent(parseJson(data, 'chat failure SSE payload'));
    return new Error(payload?.message ?? 'inference failed');
  }
}

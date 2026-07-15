import { getFailedResponseEvent, getTextDeltaEvent } from './events';
import { parseJson } from '../lib/json';
import type { ChatMessage, StreamHandlers } from './messages';

const AGENT_URL = import.meta.env.VITE_AGENT_URL || 'http://localhost:8081/cv';

export async function streamChat(messages: ChatMessage[], { onDelta, signal }: StreamHandlers = {}) {
  const res = await fetch(AGENT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
    signal,
  });
  if (!res.ok || !res.body) {
    throw new Error(`chat request failed (${res.status})`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let event = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (line === '') {
        event = '';
        continue;
      }
      if (line.startsWith('event:')) {
        event = line.slice(6).trim();
        continue;
      }
      if (line.startsWith('data:')) {
        const data = line.slice(5).trim();
        const error = readStreamEvent(event, data, onDelta);
        if (error) throw error;
      }
    }
  }
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

// SSE chat client for the hermes-logos `cv` agent. POSTs a messages array and
// streams the reply. The backend emits Server-Sent Events; we care about text
// deltas and the terminal completed/failed events.

const AGENT_URL = import.meta.env.VITE_AGENT_URL || 'http://localhost:8081/cv';

export async function streamChat(messages, { onDelta, signal } = {}) {
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
        event = ''; // blank line ends an event
        continue;
      }
      if (line.startsWith('event:')) {
        event = line.slice(6).trim();
        continue;
      }
      if (line.startsWith('data:')) {
        const data = line.slice(5).trim();
        if (event === 'response.output_text.delta') {
          try {
            const j = JSON.parse(data);
            if (j.delta) onDelta?.(j.delta);
          } catch {
            /* ignore malformed chunk */
          }
        } else if (event === 'response.failed') {
          let msg = 'inference failed';
          try {
            msg = JSON.parse(data)?.response?.error?.message || msg;
          } catch {
            /* keep default */
          }
          throw new Error(msg);
        }
      }
    }
  }
}

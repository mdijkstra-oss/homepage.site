import { describe, expect, it, vi } from 'vitest';
import { readStreamEvent } from './client';

describe('readStreamEvent', () => {
  const cases = [
    { event: 'response.output_text.delta', data: '{"delta":"Hello"}', delta: 'Hello', error: undefined },
    { event: 'response.output_text.delta', data: '{"delta":3}', delta: undefined, error: undefined },
    { event: 'response.failed', data: '{"response":{"error":{"message":"Nope"}}}', delta: undefined, error: 'Nope' },
  ];

  it.each(cases)('decodes $event', ({ event, data, delta, error }) => {
    const onDelta = vi.fn();
    const result = readStreamEvent(event, data, onDelta);
    if (delta === undefined) expect(onDelta).not.toHaveBeenCalled();
    else expect(onDelta).toHaveBeenCalledWith(delta);
    expect(result?.message).toBe(error);
  });
});

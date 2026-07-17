import { describe, expect, it } from 'vitest';
import { createEventStreamState, readEventStreamChunk, readStreamEvent } from './client';

describe('readStreamEvent', () => {
  const cases = [
    { event: 'response.output_text.delta', data: '{"delta":"Hello"}', delta: 'Hello', error: undefined },
    { event: 'response.output_text.delta', data: '{"delta":3}', delta: undefined, error: undefined },
    { event: 'response.failed', data: '{"response":{"error":{"message":"Nope"}}}', delta: undefined, error: 'Nope' },
  ];

  it.each(cases)('decodes $event', ({ event, data, delta, error }) => {
    const deltas: string[] = [];
    const onDelta = (chunk: string) => deltas.push(chunk);
    const result = readStreamEvent(event, data, onDelta);
    expect(deltas).toEqual(delta === undefined ? [] : [delta]);
    expect(result?.message).toBe(error);
  });
});

describe('readEventStreamChunk', () => {
  it.each([
    {
      name: 'flushes a final delta without a trailing newline',
      chunks: ['event: response.output_text.delta\ndata: {"delta":"Tail"}'],
      deltas: ['Tail'],
      error: undefined,
    },
    {
      name: 'handles CRLF record boundaries',
      chunks: ['event: response.output_text.delta\r\ndata: {"delta":"CRLF"}\r\n\r\n'],
      deltas: ['CRLF'],
      error: undefined,
    },
    {
      name: 'retains an incomplete line across chunks',
      chunks: ['event: response.output_text.delta\ndata: {"del', 'ta":"Split"}'],
      deltas: ['Split'],
      error: undefined,
    },
    {
      name: 'flushes a final failure without a trailing newline',
      chunks: ['event: response.failed\ndata: {"response":{"error":{"message":"Nope"}}}'],
      deltas: [],
      error: 'Nope',
    },
  ])('$name', ({ chunks, deltas: expectedDeltas, error: expectedError }) => {
    const state = createEventStreamState();
    const deltas: string[] = [];
    let error: Error | undefined;
    for (const chunk of chunks) {
      error = readEventStreamChunk(state, chunk, false, (delta) => deltas.push(delta));
      if (error) break;
    }
    error ??= readEventStreamChunk(state, '', true, (delta) => deltas.push(delta));

    expect(deltas).toEqual(expectedDeltas);
    expect(error?.message).toBe(expectedError);
  });
});

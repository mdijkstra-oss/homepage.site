import { describe, expect, it } from 'vitest';
import { parseBestScore } from './score';

describe('parseBestScore', () => {
  it.each([
    { name: 'missing value', value: null, expected: 0 },
    { name: 'whole score', value: '42', expected: 42 },
    { name: 'zero', value: '0', expected: 0 },
    { name: 'negative score', value: '-1', expected: 0 },
    { name: 'non-numeric score', value: 'high', expected: 0 },
  ])('$name', ({ value, expected }) => {
    expect(parseBestScore(value)).toBe(expected);
  });
});

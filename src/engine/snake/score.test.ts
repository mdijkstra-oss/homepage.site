import { describe, expect, it } from 'vitest';
import { parseBestScore } from './score';

describe('parseBestScore', () => {
  it.each([
    ['missing value', null, 0],
    ['whole score', '42', 42],
    ['zero', '0', 0],
    ['negative score', '-1', 0],
    ['non-numeric score', 'high', 0],
  ])('%s', (_name, value, expected) => {
    expect(parseBestScore(value)).toBe(expected);
  });
});

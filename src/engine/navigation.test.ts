import { describe, expect, it } from 'vitest';
import { selectNavigationIndex } from './navigation';
import type { BlockType } from '../data/blocks';

describe('selectNavigationIndex', () => {
  const blockOrder: readonly BlockType[] = ['user', 'profile', 'user', 'role', 'reviews'];

  it.each([
    { name: 'first block', type: 'user', expected: 0 },
    { name: 'card after prompt', type: 'profile', expected: 0 },
    { name: 'card after another prompt', type: 'role', expected: 2 },
    { name: 'card without prompt before it', type: 'reviews', expected: 4 },
    { name: 'missing type', type: 'education', expected: 0 },
  ] as const)('$name', ({ type, expected }) => {
    expect(selectNavigationIndex(blockOrder, type)).toBe(expected);
  });
});

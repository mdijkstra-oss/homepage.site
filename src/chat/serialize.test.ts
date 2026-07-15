import { describe, expect, it } from 'vitest';
import { blockToConversationText } from './serialize';

describe('blockToConversationText', () => {
  const cases = [
    { block: { type: 'user' as const, text: 'Hello' }, expected: '[user]\nHello' },
    { block: { type: 'note' as const, payload: { eyebrow: 'A', title: 'B', paragraphs: ['C'] } }, expected: '[note]\neyebrow: A\ntitle: B\nparagraphs: C' },
  ];

  it.each(cases)('serializes $block.type blocks', ({ block, expected }) => {
    expect(blockToConversationText(block)).toBe(expected);
  });
});

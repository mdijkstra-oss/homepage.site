import { describe, expect, it } from 'vitest';
import { buildMessages } from './history';
import type { ChatMessage, ChatTurn } from './messages';

describe('buildMessages', () => {
  it.each([
    {
      name: 'combines initial context, existing turns, and the new question',
      initial: [{ type: 'message', role: 'assistant', content: 'Initial context' }] satisfies ChatMessage[],
      turns: [{ id: 1, role: 'user', text: 'Earlier question' }] satisfies ChatTurn[],
      question: 'Current question',
      expected: ['Initial context', 'Earlier question', 'Current question'],
    },
    {
      name: 'works without initial context or earlier turns',
      initial: [] satisfies ChatMessage[],
      turns: [] satisfies ChatTurn[],
      question: 'Only question',
      expected: ['Only question'],
    },
  ])('$name', ({ initial, turns, question, expected }) => {
    expect(buildMessages(initial, turns, question).map((message) => message.content)).toEqual(expected);
  });
});

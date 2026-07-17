import { describe, expect, it } from 'vitest';
import type { ContentSection } from '../model/types';
import { selectPortfolioChatHistory } from './portfolioChatHistory';

describe('selectPortfolioChatHistory', () => {
  it('turns each prompt and card into ordered chat context', () => {
    const sections: readonly ContentSection[] = [
      {
        id: 'history',
        prompt: 'Where did he start?',
        blocks: [{ type: 'note', payload: { eyebrow: 'Start', title: 'Early work', paragraphs: ['Details'] } }],
      },
    ];

    expect(selectPortfolioChatHistory(sections)).toEqual([
      { type: 'message', role: 'user', content: 'Where did he start?' },
      {
        type: 'message',
        role: 'assistant',
        content: '[note]\neyebrow: Start\ntitle: Early work\nparagraphs: Details',
      },
    ]);
  });
});

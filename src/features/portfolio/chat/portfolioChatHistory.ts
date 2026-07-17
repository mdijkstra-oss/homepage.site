import type { ChatMessage } from '../../chat/conversation/messages';
import { SECTIONS } from '../model/sections';
import type { ContentSection } from '../model/types';
import { blockToConversationText } from './serializeBlock';

export const PORTFOLIO_CHAT_HISTORY: readonly ChatMessage[] = selectPortfolioChatHistory(SECTIONS);

export function selectPortfolioChatHistory(sections: readonly ContentSection[]): ChatMessage[] {
  return sections.flatMap(sectionToChatMessages);
}

function sectionToChatMessages(section: ContentSection): ChatMessage[] {
  return [
    { type: 'message', role: 'user', content: section.prompt },
    ...section.blocks.map(
      (block): ChatMessage => ({ type: 'message', role: 'assistant', content: blockToConversationText(block) }),
    ),
  ];
}

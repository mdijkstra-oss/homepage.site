import { BLOCKS } from '../data/prompts';
import { blockToConversationText } from './serialize';
import type { ChatMessage, LiveTurn } from './messages';
import type { Block } from '../data/blocks';

const CHAT_HISTORY: ChatMessage[] = BLOCKS.map(blockToChatMessage);

export function buildMessages(live: LiveTurn[], userText: string): ChatMessage[] {
  return [
    ...CHAT_HISTORY,
    ...live.map((m): ChatMessage => ({ type: 'message', role: m.role, content: m.text })),
    { type: 'message', role: 'user', content: userText },
  ];
}

function blockToChatMessage(block: Block): ChatMessage {
  return block.type === 'user'
    ? { type: 'message', role: 'user', content: block.text }
    : { type: 'message', role: 'assistant', content: blockToConversationText(block) };
}

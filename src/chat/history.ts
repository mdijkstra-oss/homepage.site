import { BLOCKS } from '../data/prompts';
import { blockToText } from './serialize';
import type { Message, LiveTurn } from '../types/chat';

// The preloaded feed replayed as prior chat turns: scripted `user` blocks
// become user turns, every content card becomes an assistant turn. This is the
// "content already on screen" context the LLM answers against. Computed once.
const BASE_HISTORY: Message[] = BLOCKS.map((b) =>
  b.type === 'user'
    ? { type: 'message', role: 'user', content: b.text }
    : { type: 'message', role: 'assistant', content: blockToText(b) },
);

// Build the full messages array for a new question: preloaded feed + any live
// turns so far + the new user message.
export function buildMessages(live: LiveTurn[], userText: string): Message[] {
  return [
    ...BASE_HISTORY,
    ...live.map((m): Message => ({ type: 'message', role: m.role, content: m.text })),
    { type: 'message', role: 'user', content: userText },
  ];
}

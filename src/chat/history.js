import { BLOCKS } from '../data/prompts.js';
import { blockToText } from './serialize.js';

// The preloaded feed replayed as prior chat turns: scripted `user` blocks
// become user turns, every content card becomes an assistant turn. This is the
// "content already on screen" context the LLM answers against. Computed once.
const BASE_HISTORY = BLOCKS.map((b) =>
  b.type === 'user'
    ? { type: 'message', role: 'user', content: b.text }
    : { type: 'message', role: 'assistant', content: blockToText(b) },
);

// Build the full messages array for a new question: preloaded feed + any live
// turns so far + the new user message. `live` items are { role, text }.
export function buildMessages(live, userText) {
  return [
    ...BASE_HISTORY,
    ...live.map((m) => ({ type: 'message', role: m.role, content: m.text })),
    { type: 'message', role: 'user', content: userText },
  ];
}

import type { ChatMessage, ChatTurn } from './messages';

export function buildMessages(
  initialMessages: readonly ChatMessage[],
  turns: readonly ChatTurn[],
  userText: string,
): ChatMessage[] {
  return [
    ...initialMessages,
    ...turns.map((turn): ChatMessage => ({ type: 'message', role: turn.role, content: turn.text })),
    { type: 'message', role: 'user', content: userText },
  ];
}

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  type: 'message';
  role: ChatRole;
  content: string;
}

export interface ChatTurn {
  id: number;
  role: ChatRole;
  text: string;
}

export interface StreamHandlers {
  onDelta?: (chunk: string) => void;
  signal?: AbortSignal;
}

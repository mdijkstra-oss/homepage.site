import type { ChatRole } from '../types/blocks';

export interface ChatMessage {
  type: 'message';
  role: ChatRole;
  content: string;
}

export interface LiveTurn {
  id: number;
  role: ChatRole;
  text: string;
}

export interface StreamHandlers {
  onDelta?: (chunk: string) => void;
  signal?: AbortSignal;
}

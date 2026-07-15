import type { ChatRole } from './blocks';

// The wire shape the `cv` agent expects: an ordered list of message turns.
export interface Message {
  type: 'message';
  role: ChatRole;
  content: string;
}

// A live turn held in App state while it streams (and after).
export interface LiveTurn {
  id: number;
  role: ChatRole;
  text: string;
}

// The SSE events emitted by the backend that this client acts on. Other event
// types are ignored. `data` is the JSON payload carried on the `data:` line.
export interface TextDeltaEvent {
  event: 'response.output_text.delta';
  data: { delta?: string };
}

export interface ResponseFailedEvent {
  event: 'response.failed';
  data: { response?: { error?: { message?: string } } };
}

export type StreamHandlers = {
  onDelta?: (chunk: string) => void;
  signal?: AbortSignal;
};

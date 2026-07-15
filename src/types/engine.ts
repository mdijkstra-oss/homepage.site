import type { BlockType } from './blocks';

export interface BubbleRegister {
  add: (el: HTMLElement | null) => void;
  remove: (el: HTMLElement | null) => void;
}

export interface BreakPillStatus {
  canShow: boolean;
  label: string;
}

export type GamePhase = 'countdown' | 'play' | 'paused' | 'dead' | null;

export interface GameStatus {
  phase: GamePhase;
  score: number;
  best: number;
  newBest: boolean;
  countdownLabel: string | null;
}

// The public surface App.tsx drives — everything else is engine-private.
export interface EngineHandle {
  mount: (root: HTMLElement) => void;
  destroy: () => void;
  jumpToType: (type: BlockType) => void;
  addBubble: (el: HTMLElement | null) => void;
  removeBubble: (el: HTMLElement | null) => void;
  onBreakStatusChange: (cb: (status: BreakPillStatus) => void) => () => void;
  onGameStatusChange: (cb: (status: GameStatus) => void) => () => void;
  triggerBreakPill: (origin: { x: number; y: number }) => void;
  restartGame: () => void;
  quitGame: () => void;
}

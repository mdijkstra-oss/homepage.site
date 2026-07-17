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

export interface GameCanvasTargets {
  gol: HTMLCanvasElement;
  burst: HTMLCanvasElement;
}

export interface GameEngineHandle {
  mount: (targets: GameCanvasTargets) => void;
  destroy: () => void;
  onBreakStatusChange: (cb: (status: BreakPillStatus) => void) => () => void;
  onGameStatusChange: (cb: (status: GameStatus) => void) => () => void;
  startOrResume: (origin: { x: number; y: number }) => void;
  restartGame: () => void;
  quitGame: () => void;
}

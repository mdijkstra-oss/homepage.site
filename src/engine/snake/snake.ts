import { clamp } from '../../lib/clamp';

export interface SnakeConfig {
  initialStepMs: number;
  minimumStepMs: number;
  stepReductionPerPointMs: number;
  cellGapPx: number;
  pickupParticleCount: number;
  pickupParticleSpeed: number;
}

export interface SnakeCell {
  c: number;
  r: number;
}

export interface Dir {
  dc: number;
  dr: number;
}

export type SnakeStepResult =
  | { kind: 'moved'; snake: SnakeCell[] }
  | { kind: 'ate'; snake: SnakeCell[]; ateIndex: number }
  | { kind: 'died' };

const KEY_DIRS: Readonly<Record<string, Dir>> = {
  arrowup: { dc: 0, dr: -1 },
  w: { dc: 0, dr: -1 },
  arrowdown: { dc: 0, dr: 1 },
  s: { dc: 0, dr: 1 },
  arrowleft: { dc: -1, dr: 0 },
  a: { dc: -1, dr: 0 },
  arrowright: { dc: 1, dr: 0 },
  d: { dc: 1, dr: 0 },
};

export function spawnSnakeAt(cols: number, rows: number): { snake: SnakeCell[]; dir: Dir } {
  const c0 = clamp(Math.round(cols * 0.5), 6, cols - 2);
  const r0 = clamp(Math.round(rows * (2 / 3)), 3, rows - 4);
  const snake = Array.from({ length: 5 }, (_, i) => ({ c: clamp(c0 - i, 0, cols - 1), r: r0 }));
  return { snake, dir: { dc: 1, dr: 0 } };
}

export function stepSnake(
  snake: ReadonlyArray<SnakeCell>,
  dir: Dir,
  cols: number,
  rows: number,
  cellVisible: (idx: number) => number,
): SnakeStepResult {
  const nc = (snake[0].c + dir.dc + cols) % cols;
  const nr = (snake[0].r + dir.dr + rows) % rows;
  const idx = nr * cols + nc;
  const ate = cellVisible(idx) > 0.1;
  const body = ate ? snake : snake.slice(0, -1);
  if (body.some((s) => s.c === nc && s.r === nr)) return { kind: 'died' };
  const next = [{ c: nc, r: nr }, ...body];
  return ate ? { kind: 'ate', snake: next, ateIndex: idx } : { kind: 'moved', snake: next };
}

export function isDirectionKey(key: string): boolean {
  return key in KEY_DIRS;
}

export function nextPendingDir(key: string, current: Dir): Dir | null {
  const dir = KEY_DIRS[key];
  if (!dir) return null;
  if (dir.dc === -current.dc && dir.dr === -current.dr) return null;
  return dir;
}

export function cellAt(x: number, y: number, cellSize: number, cols: number, rows: number): { c: number; r: number } {
  return {
    c: clamp(Math.floor(x / cellSize), 0, cols - 1),
    r: clamp(Math.floor(y / cellSize), 0, rows - 1),
  };
}

export function nextSnakeInterval(cfg: SnakeConfig, score: number): number {
  return Math.max(cfg.minimumStepMs, cfg.initialStepMs - score * cfg.stepReductionPerPointMs);
}

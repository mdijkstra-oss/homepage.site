import { clamp } from '../../lib/clamp';
import type { Dir, SnakeCell } from './snake';

let arrowPath: Path2D | null = null;
const COUNTDOWN_ARROW_BASE_ALPHA = 0.85;
const COUNTDOWN_ARROW_PULSE_ALPHA = 0.15;
const COUNTDOWN_ARROW_PULSE_SPEED = 0.008;
const PLAY_ARROW_FADE_MS = 280;

function getArrowPath(): Path2D {
  return arrowPath ??= new Path2D('M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z');
}

export function drawSnakeBody(ctx: CanvasRenderingContext2D, snake: readonly SnakeCell[], cellSize: number, gap: number): void {
  const inset = gap / 2, size = cellSize - gap;
  ctx.globalAlpha = 0.6;
  ctx.fillStyle = '#ffffff';
  for (let i = snake.length - 1; i >= 0; i--) {
    const s = snake[i];
    ctx.fillRect(s.c * cellSize + inset, s.r * cellSize + inset, size, size);
  }
  ctx.globalAlpha = 1;
}

export function cutSnakeArrow(ctx: CanvasRenderingContext2D, head: SnakeCell, dir: Dir, cellSize: number, alpha: number): void {
  if (alpha <= 0.01) return;
  const cx = head.c * cellSize + cellSize / 2, cy = head.r * cellSize + cellSize / 2;
  const angle = Math.atan2(dir.dr, dir.dc) + Math.PI / 2;
  const scale = (cellSize * 0.58) / 24;
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.globalAlpha = clamp(alpha, 0, 1);
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.scale(scale, scale);
  ctx.translate(-12, -12);
  ctx.fill(getArrowPath());
  ctx.restore();
}

export function countdownArrowAlpha(now: number): number {
  return COUNTDOWN_ARROW_BASE_ALPHA + COUNTDOWN_ARROW_PULSE_ALPHA * Math.sin(now * COUNTDOWN_ARROW_PULSE_SPEED);
}

export function playArrowAlpha(elapsedMs: number): number | null {
  const t = elapsedMs / PLAY_ARROW_FADE_MS;
  return t < 1 ? 1 - t : null;
}

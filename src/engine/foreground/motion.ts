import { clamp } from '../../lib/clamp';
import { smootherstep } from '../../lib/easing';

export interface ForegroundConfig {
  revealViewportRatio: number;
  revealDurationMs: number;
  revealRisePx: number;
  revealDriftPx: number;
  revealTiltDeg: number;
  revealInitialScale: number;
  revealBlurPx: number;
  flyDurationMs: number;
}

export interface EntryFrame {
  x: number;
  y: number;
  scale: number;
  blur: number;
  brightness: number;
  rotX: number;
  rotZ: number;
  opacity: number;
}

export interface FlyVector {
  dx: number;
  dy: number;
  dist: number;
  rot: number;
  delay: number;
}

export function computeEntryProgress(clockProgress: number, positionProgress: number, previousProgress: number): number {
  return Math.max(clockProgress, positionProgress, previousProgress);
}

export function computeEntryFrame(p: number, cfg: ForegroundConfig, dir: 1 | -1): EntryFrame {
  const e = smootherstep(p);
  return {
    x: (1 - e) * cfg.revealDriftPx * dir,
    y: (1 - e) * cfg.revealRisePx,
    scale: cfg.revealInitialScale + e * (1 - cfg.revealInitialScale),
    blur: (1 - e) * cfg.revealBlurPx,
    brightness: 0.75 + e * 0.25,
    rotX: (1 - e) * -cfg.revealTiltDeg,
    rotZ: (1 - e) * cfg.revealTiltDeg * 0.1 * dir,
    opacity: clamp(p * 3, 0, 1),
  };
}

export function computeFlyVector(
  elCenter: { x: number; y: number },
  origin: { x: number; y: number },
  seed: { x: number; r: number },
  viewport: { w: number; h: number },
): FlyVector {
  let dx = elCenter.x - origin.x, dy = elCenter.y - origin.y;
  let len = Math.hypot(dx, dy);
  if (len < 1) {
    const angle = seed.x * Math.PI;
    dx = Math.cos(angle); dy = Math.sin(angle); len = 1;
  }
  const diag = Math.hypot(viewport.w, viewport.h);
  return { dx: dx / len, dy: dy / len, dist: diag * 1.65, rot: seed.r * 18, delay: 0 };
}

export function computeFlyOffset(fp: number, fly: FlyVector, entry: EntryFrame): EntryFrame {
  const lp = clamp((fp - fly.delay) / (1 - fly.delay), 0, 1);
  const a = 1 - Math.pow(1 - lp, 2.6);
  return {
    ...entry,
    x: entry.x + fly.dx * fly.dist * a,
    y: entry.y + fly.dy * fly.dist * a,
    rotZ: fly.rot * lp,
    scale: entry.scale * (1 + 0.08 * lp),
    opacity: entry.opacity * (1 - clamp((lp - 0.55) / 0.45, 0, 1)),
    blur: Math.max(entry.blur, lp > 0.15 ? (lp - 0.15) * 13 : 0),
  };
}

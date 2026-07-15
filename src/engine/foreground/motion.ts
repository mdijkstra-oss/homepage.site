import { clamp } from '../../lib/clamp';
import { smootherstep } from '../../lib/easing';

export interface ForegroundConfig {
  animStart: number;
  animDur: number;
  animRise: number;
  animDrift: number;
  animTilt: number;
  animScale: number;
  animBlur: number;
  flyDur: number;
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

// Forward-only latch: progress never rewinds once it has advanced.
export function computeEntryProgress(clockP: number, posP: number, priorP: number): number {
  return Math.max(clockP, posP, priorP);
}

export function computeEntryFrame(p: number, cfg: ForegroundConfig, dir: 1 | -1): EntryFrame {
  const e = smootherstep(p);
  return {
    x: (1 - e) * cfg.animDrift * dir,
    y: (1 - e) * cfg.animRise,
    scale: cfg.animScale + e * (1 - cfg.animScale),
    blur: (1 - e) * cfg.animBlur,
    brightness: 0.75 + e * 0.25,
    rotX: (1 - e) * -cfg.animTilt,
    rotZ: (1 - e) * cfg.animTilt * 0.1 * dir,
    opacity: clamp(p * 3, 0, 1),
  };
}

// Per-item radial launch vector, captured once at trigger time from the
// item's position relative to the blast origin.
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

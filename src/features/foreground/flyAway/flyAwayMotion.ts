import { clamp } from '../../../lib/clamp';

export interface FlyVector {
  dx: number;
  dy: number;
  dist: number;
  rot: number;
}

export interface FlyFrame {
  x: number;
  y: number;
  scale: number;
  blur: number;
  rot: number;
  opacity: number;
}

export function computeFlyVector(
  elementCenter: { x: number; y: number },
  origin: { x: number; y: number },
  seed: { x: number; r: number },
  viewport: { w: number; h: number },
): FlyVector {
  let dx = elementCenter.x - origin.x;
  let dy = elementCenter.y - origin.y;
  let length = Math.hypot(dx, dy);
  if (length < 1) {
    const angle = seed.x * Math.PI;
    dx = Math.cos(angle);
    dy = Math.sin(angle);
    length = 1;
  }
  const diagonal = Math.hypot(viewport.w, viewport.h);
  return { dx: dx / length, dy: dy / length, dist: diagonal * 1.65, rot: seed.r * 18 };
}

export function computeFlyFrame(progress: number, vector: FlyVector): FlyFrame {
  const p = clamp(progress, 0, 1);
  const eased = 1 - (1 - p) ** 2.6;
  return {
    x: vector.dx * vector.dist * eased,
    y: vector.dy * vector.dist * eased,
    rot: vector.rot * p,
    scale: 1 + 0.08 * p,
    opacity: 1 - clamp((p - 0.55) / 0.45, 0, 1),
    blur: p > 0.15 ? (p - 0.15) * 13 : 0,
  };
}

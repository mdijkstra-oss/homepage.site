import { describe, expect, it } from 'vitest';
import { computeFlyFrame, computeFlyVector } from './flyAwayMotion';

describe('computeFlyVector', () => {
  const viewport = { w: 1200, h: 800 };

  it.each([
    {
      name: 'uses a seed-derived angle at the origin',
      center: { x: 0, y: 0 },
      origin: { x: 0, y: 0 },
      seed: { x: 0.5, r: 0.5 },
      dx: Math.cos(0.5 * Math.PI),
      dy: Math.sin(0.5 * Math.PI),
      rotation: 9,
    },
    {
      name: 'normalizes the direction away from the origin',
      center: { x: 100, y: 100 },
      origin: { x: 0, y: 0 },
      seed: { x: 0, r: 1 },
      dx: Math.SQRT1_2,
      dy: Math.SQRT1_2,
      rotation: 18,
    },
  ])('$name', ({ center, origin, seed, dx, dy, rotation }) => {
    const vector = computeFlyVector(center, origin, seed, viewport);
    expect(vector.dx).toBeCloseTo(dx);
    expect(vector.dy).toBeCloseTo(dy);
    expect(vector.dist).toBeCloseTo(Math.hypot(viewport.w, viewport.h) * 1.65);
    expect(vector.rot).toBe(rotation);
  });
});

describe('computeFlyFrame', () => {
  const vector = { dx: 1, dy: 0, dist: 1000, rot: 18 };

  it.each([
    { name: 'starts at rest', progress: 0, x: 0, scale: 1, opacity: 1, blur: 0 },
    { name: 'ends offscreen', progress: 1, x: 1000, scale: 1.08, opacity: 0, blur: 11.05 },
  ])('$name', ({ progress, x, scale, opacity, blur }) => {
    const frame = computeFlyFrame(progress, vector);
    expect(frame.x).toBeCloseTo(x);
    expect(frame.scale).toBeCloseTo(scale);
    expect(frame.opacity).toBeCloseTo(opacity);
    expect(frame.blur).toBeCloseTo(blur);
  });
});

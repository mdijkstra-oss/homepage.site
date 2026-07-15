import { describe, expect, it } from 'vitest';
import { computeEntryFrame, computeEntryProgress, computeFlyOffset, computeFlyVector } from './motion';

describe('computeEntryProgress', () => {
  it.each([
    {
      name: 'position progress can reveal ahead of time',
      clockProgress: 0.2,
      positionProgress: 0.5,
      previousProgress: 0,
      expected: 0.5,
    },
    {
      name: 'clock progress can carry reveal forward',
      clockProgress: 0.9,
      positionProgress: 0.1,
      previousProgress: 0,
      expected: 0.9,
    },
    {
      name: 'previous progress keeps reveal monotonic',
      clockProgress: 0.3,
      positionProgress: 0.2,
      previousProgress: 0.7,
      expected: 0.7,
    },
  ])('$name', ({ clockProgress, positionProgress, previousProgress, expected }) => {
    expect(computeEntryProgress(clockProgress, positionProgress, previousProgress)).toBe(expected);
  });
});

describe('computeEntryFrame', () => {
  const fullCfg = {
    revealViewportRatio: 0.74,
    revealDurationMs: 700,
    revealRisePx: 34,
    revealDriftPx: 22,
    revealTiltDeg: 14,
    revealInitialScale: 0.94,
    revealBlurPx: 3,
    flyDurationMs: 1050,
  };

  it('at p=0 returns the fully-offset starting frame', () => {
    const frame = computeEntryFrame(0, fullCfg, 1);
    expect(frame.x).toBeCloseTo(22);
    expect(frame.y).toBeCloseTo(34);
    expect(frame.scale).toBeCloseTo(0.94);
    expect(frame.blur).toBeCloseTo(3);
    expect(frame.brightness).toBeCloseTo(0.75);
    expect(frame.rotX).toBeCloseTo(-14);
    expect(frame.rotZ).toBeCloseTo(1.4);
    expect(frame.opacity).toBe(0);
  });

  it('at p=1 returns the settled frame', () => {
    const frame = computeEntryFrame(1, fullCfg, 1);
    expect(frame.x).toBeCloseTo(0);
    expect(frame.y).toBeCloseTo(0);
    expect(frame.scale).toBeCloseTo(1);
    expect(frame.blur).toBeCloseTo(0);
    expect(frame.brightness).toBeCloseTo(1);
    expect(frame.rotX).toBeCloseTo(0);
    expect(frame.rotZ).toBeCloseTo(0);
    expect(frame.opacity).toBe(1);
  });

  it('flips lateral drift and roll sign with dir, leaves depth tilt untouched', () => {
    const right = computeEntryFrame(0, fullCfg, 1);
    const left = computeEntryFrame(0, fullCfg, -1);
    expect(left.x).toBe(-right.x);
    expect(left.rotZ).toBe(-right.rotZ);
    expect(left.rotX).toBe(right.rotX);
  });
});

describe('computeFlyVector', () => {
  const viewport = { w: 1200, h: 800 };
  const diag = Math.hypot(1200, 800);

  it('falls back to a seed-derived angle when the item sits on the origin', () => {
    const v = computeFlyVector({ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0.5, r: 0.5 }, viewport);
    expect(v.dx).toBeCloseTo(Math.cos(0.5 * Math.PI));
    expect(v.dy).toBeCloseTo(Math.sin(0.5 * Math.PI));
    expect(v.dist).toBeCloseTo(diag * 1.65);
    expect(v.rot).toBe(9);
    expect(v.delay).toBe(0);
  });

  it('normalizes the direction away from the origin otherwise', () => {
    const v = computeFlyVector({ x: 100, y: 100 }, { x: 0, y: 0 }, { x: 0, r: 1 }, viewport);
    expect(v.dx).toBeCloseTo(Math.SQRT1_2);
    expect(v.dy).toBeCloseTo(Math.SQRT1_2);
    expect(v.dist).toBeCloseTo(diag * 1.65);
    expect(v.rot).toBe(18);
  });
});

describe('computeFlyOffset', () => {
  const entry = { x: 0, y: 0, scale: 1, blur: 0, brightness: 1, rotX: 0, rotZ: 0, opacity: 1 };
  const fly = { dx: 1, dy: 0, dist: 1000, rot: 18, delay: 0 };

  it('adds no offset before launch (fp=0)', () => {
    const frame = computeFlyOffset(0, fly, entry);
    expect(frame.x).toBe(0);
    expect(frame.scale).toBeCloseTo(1);
    expect(frame.opacity).toBeCloseTo(1);
  });

  it('reaches full launch distance and fades out at fp=1', () => {
    const frame = computeFlyOffset(1, fly, entry);
    expect(frame.x).toBeCloseTo(1000);
    expect(frame.rotZ).toBe(18);
    expect(frame.scale).toBeCloseTo(1.08);
    expect(frame.opacity).toBeCloseTo(0);
    expect(frame.blur).toBeCloseTo(11.05);
  });
});

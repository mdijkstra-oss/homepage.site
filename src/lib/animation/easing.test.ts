import { describe, expect, it } from 'vitest';
import { smootherstep, smoothstep } from './easing';

describe.each([
  ['smoothstep', smoothstep],
  ['smootherstep', smootherstep],
])('%s', (_name, fn) => {
  it('is 0 at p=0 and 1 at p=1', () => {
    expect(fn(0)).toBe(0);
    expect(fn(1)).toBe(1);
  });

  it('is monotonically increasing across sampled points', () => {
    const samples = [0, 0.1, 0.25, 0.4, 0.5, 0.6, 0.75, 0.9, 1].map(fn);
    for (let i = 1; i < samples.length; i++) expect(samples[i]).toBeGreaterThanOrEqual(samples[i - 1]);
  });
});

it('smoothstep(0.5) matches the known constant', () => {
  expect(smoothstep(0.5)).toBeCloseTo(0.5);
});

it('smootherstep(0.5) matches the known constant', () => {
  expect(smootherstep(0.5)).toBeCloseTo(0.5);
});

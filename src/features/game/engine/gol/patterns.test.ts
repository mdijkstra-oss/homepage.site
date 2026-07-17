import { describe, expect, it } from 'vitest';
import { PATTERNS, patternDims, patternFits, stampPattern } from './patterns';

describe('patternDims', () => {
  const cases: Array<{ name: keyof typeof PATTERNS; expected: { w: number; h: number } }> = [
    { name: 'blinker', expected: { w: 3, h: 1 } },
    { name: 'glider', expected: { w: 3, h: 3 } },
    { name: 'toad', expected: { w: 4, h: 2 } },
    { name: 'beacon', expected: { w: 4, h: 4 } },
    { name: 'penta', expected: { w: 10, h: 3 } },
  ];

  it.each(cases)('$name', ({ name, expected }) => {
    expect(patternDims(PATTERNS[name])).toEqual(expected);
  });
});

describe('patternFits', () => {
  const blinker = PATTERNS.blinker;

  it.each([
    { name: 'fully in bounds', ox: 0, oy: 0, flipX: false, flipY: false, cols: 5, rows: 5, expected: true },
    { name: 'flipped still in bounds', ox: 2, oy: 0, flipX: true, flipY: false, cols: 5, rows: 5, expected: true },
    { name: 'runs past right edge', ox: 3, oy: 0, flipX: false, flipY: false, cols: 5, rows: 5, expected: false },
    { name: 'runs past top edge', ox: 0, oy: -1, flipX: false, flipY: false, cols: 5, rows: 5, expected: false },
  ] as const)('$name', ({ ox, oy, flipX, flipY, cols, rows, expected }) => {
    expect(patternFits(blinker, ox, oy, flipX, flipY, cols, rows)).toBe(expected);
  });
});

describe('stampPattern', () => {
  it('sets exactly the blinker cells at the given origin', () => {
    const grid = new Uint8Array(5 * 5);
    const stamped = stampPattern(grid, 5, PATTERNS.blinker, 1, 1, false, false);
    expect([...grid]).toEqual([...new Uint8Array(grid.length)]);
    const live = [...stamped].map((v, i) => (v ? i : -1)).filter((i) => i >= 0);
    expect(live).toEqual([6, 7, 8]);
  });

  it('flips both axes around the origin', () => {
    const grid = new Uint8Array(5 * 5);
    const stamped = stampPattern(grid, 5, PATTERNS.blinker, 3, 3, true, true);
    const live = [...stamped].map((v, i) => (v ? i : -1)).filter((i) => i >= 0);
    expect(live).toEqual([16, 17, 18]);
  });

  it('drops cells that land outside the grid', () => {
    const grid = new Uint8Array(3 * 3);
    const stamped = stampPattern(grid, 3, PATTERNS.blinker, 1, 0, false, false);
    const live = [...stamped].map((v, i) => (v ? i : -1)).filter((i) => i >= 0);
    expect(live).toEqual([1, 2]);
  });
});

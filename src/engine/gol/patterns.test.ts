import { describe, expect, it } from 'vitest';
import { PATTERNS, patternDims, patternFits, stampPattern } from './patterns';

describe('patternDims', () => {
  const cases: Array<[keyof typeof PATTERNS, { w: number; h: number }]> = [
    ['blinker', { w: 3, h: 1 }],
    ['glider', { w: 3, h: 3 }],
    ['toad', { w: 4, h: 2 }],
    ['beacon', { w: 4, h: 4 }],
    ['penta', { w: 10, h: 3 }],
  ];

  it.each(cases)('%s -> %o', (name, expected) => {
    expect(patternDims(PATTERNS[name])).toEqual(expected);
  });
});

describe('patternFits', () => {
  const blinker = PATTERNS.blinker;

  it.each([
    ['fully in bounds', 0, 0, false, false, 5, 5, true],
    ['flipped still in bounds', 2, 0, true, false, 5, 5, true],
    ['runs past right edge', 3, 0, false, false, 5, 5, false],
    ['runs past top edge', 0, -1, false, false, 5, 5, false],
  ] as const)('%s', (_label, ox, oy, flipX, flipY, cols, rows, expected) => {
    expect(patternFits(blinker, ox, oy, flipX, flipY, cols, rows)).toBe(expected);
  });
});

describe('stampPattern', () => {
  it('sets exactly the blinker cells at the given origin', () => {
    const grid = new Uint8Array(5 * 5);
    const stamped = stampPattern(grid, 5, PATTERNS.blinker, 1, 1, false, false);
    expect([...grid]).toEqual([...new Uint8Array(grid.length)]);
    const live = [...stamped].map((v, i) => (v ? i : -1)).filter((i) => i >= 0);
    expect(live).toEqual([6, 7, 8]); // row 1, cols 1..3
  });

  it('flips both axes around the origin', () => {
    const grid = new Uint8Array(5 * 5);
    const stamped = stampPattern(grid, 5, PATTERNS.blinker, 3, 3, true, true);
    const live = [...stamped].map((v, i) => (v ? i : -1)).filter((i) => i >= 0);
    expect(live).toEqual([16, 17, 18]); // row 3, cols 1..3 (mirrored)
  });

  it('drops cells that land outside the grid', () => {
    const grid = new Uint8Array(3 * 3);
    const stamped = stampPattern(grid, 3, PATTERNS.blinker, 1, 0, false, false);
    const live = [...stamped].map((v, i) => (v ? i : -1)).filter((i) => i >= 0);
    expect(live).toEqual([1, 2]); // col 3 (x=3) falls off a 3-wide grid
  });
});

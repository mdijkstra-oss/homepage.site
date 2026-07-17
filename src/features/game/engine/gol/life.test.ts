import { describe, expect, it } from 'vitest';
import {
  computeColors,
  inField,
  nextStaleCount,
  seedLife,
  shouldReseed,
  spawnFillers,
  spawnGliders,
  stepLife,
} from './life';
import { PATTERNS } from './patterns';

function makeGrid(cols: number, rows: number, live: Array<[number, number]>): Uint8Array {
  const g = new Uint8Array(cols * rows);
  for (const [x, y] of live) g[y * cols + x] = 1;
  return g;
}

function liveCells(grid: Uint8Array, cols: number): Array<[number, number]> {
  return [...grid]
    .map((v, i) => (v ? ([i % cols, Math.floor(i / cols)] as [number, number]) : null))
    .filter((c): c is [number, number] => c !== null);
}

describe('inField', () => {
  const dims = { cols: 10, rows: 10 };
  it.each([
    { name: 'top-left corner of the inset', x: 1, y: 2, expected: true },
    { name: 'bottom-right corner of the inset', x: 8, y: 6, expected: true },
    { name: 'left edge excluded', x: 0, y: 5, expected: false },
    { name: 'top edge excluded', x: 5, y: 1, expected: false },
    { name: 'right edge excluded', x: 9, y: 5, expected: false },
    { name: 'bottom edge excluded', x: 5, y: 7, expected: false },
  ] as const)('$name', ({ x, y, expected }) => {
    expect(inField(x, y, dims)).toBe(expected);
  });
});

describe('stepLife', () => {
  it('keeps a still life (2x2 block) unchanged', () => {
    const dims = { cols: 10, rows: 10 };
    const grid = makeGrid(10, 10, [
      [4, 4],
      [5, 4],
      [4, 5],
      [5, 5],
    ]);
    const { grid: next } = stepLife(grid, dims);
    expect(liveCells(next, 10).sort()).toEqual(
      [
        [4, 4],
        [4, 5],
        [5, 4],
        [5, 5],
      ].sort(),
    );
  });

  it('oscillates a blinker between horizontal and vertical', () => {
    const dims = { cols: 10, rows: 10 };
    const horizontal = makeGrid(10, 10, [
      [3, 5],
      [4, 5],
      [5, 5],
    ]);
    const step1 = stepLife(horizontal, dims);
    expect(liveCells(step1.grid, 10).sort()).toEqual(
      [
        [4, 4],
        [4, 5],
        [4, 6],
      ].sort(),
    );
    const step2 = stepLife(step1.grid, dims);
    expect(liveCells(step2.grid, 10).sort()).toEqual(
      [
        [3, 5],
        [4, 5],
        [5, 5],
      ].sort(),
    );
  });

  it('translates a glider by (1,1) after 4 steps', () => {
    const dims = { cols: 20, rows: 20 };
    let grid = makeGrid(
      20,
      20,
      PATTERNS.glider.map(([x, y]) => [x + 5, y + 5] as [number, number]),
    );
    for (let i = 0; i < 4; i++) grid = stepLife(grid, dims).grid;
    const expected = PATTERNS.glider.map(([x, y]) => [x + 6, y + 6] as [number, number]);
    expect(liveCells(grid, 20).sort()).toEqual(expected.sort());
  });

  it('kills an overcrowded cell and starves an isolated one', () => {
    const dims = { cols: 10, rows: 10 };
    const grid = makeGrid(10, 10, [
      [4, 4],
      [4, 5],
      [4, 3],
      [3, 4],
      [5, 4],
    ]);
    const { grid: next } = stepLife(grid, dims);
    expect(next[4 * 10 + 4]).toBe(0);
  });

  it('suppresses birth outside the inset field even with 3 neighbours', () => {
    const dims = { cols: 10, rows: 10 };
    const grid = makeGrid(10, 10, [
      [1, 4],
      [1, 5],
      [1, 6],
    ]);
    const { grid: next } = stepLife(grid, dims);
    expect(next[5 * 10 + 0]).toBe(0);
  });
});

describe('seedLife', () => {
  it('is deterministic for a fixed rng and stays within the inset field', () => {
    const dims = { cols: 24, rows: 24 };
    const rngSeq = () => {
      let s = 1;
      return () => {
        s = (s * 1103515245 + 12345) % 2147483648;
        return s / 2147483648;
      };
    };
    const gridA = seedLife(dims, PATTERNS, rngSeq());
    const gridB = seedLife(dims, PATTERNS, rngSeq());
    expect([...gridA]).toEqual([...gridB]);
    for (const [x, y] of liveCells(gridA, dims.cols)) {
      expect(x).toBeGreaterThanOrEqual(1);
      expect(x).toBeLessThanOrEqual(dims.cols - 2);
      expect(y).toBeGreaterThanOrEqual(2);
      expect(y).toBeLessThanOrEqual(dims.rows - 4);
    }
  });
});

describe('nextStaleCount', () => {
  it.each([
    { name: 'increments when alive count is low', alive: 3, prevStale: 0, expected: 1 },
    { name: 'keeps accumulating stale rounds', alive: 3, prevStale: 4, expected: 5 },
    { name: 'resets when alive count recovers', alive: 20, prevStale: 5, expected: 0 },
  ])('$name', ({ alive, prevStale, expected }) => {
    expect(nextStaleCount(alive, prevStale)).toBe(expected);
  });
});

describe('shouldReseed', () => {
  const dims = { cols: 20, rows: 20 };
  it.each([
    { name: 'too many stale rounds', alive: 10, dims, staleRounds: 3, generation: 10, expected: true },
    { name: 'overcrowded', alive: 200, dims, staleRounds: 0, generation: 10, expected: true },
    { name: 'generation ceiling hit', alive: 10, dims, staleRounds: 0, generation: 461, expected: true },
    { name: 'healthy grid', alive: 50, dims, staleRounds: 0, generation: 10, expected: false },
  ] as const)('$name', ({ alive, dims, staleRounds, generation, expected }) => {
    expect(shouldReseed(alive, dims, staleRounds, generation)).toBe(expected);
  });
});

describe('spawnFillers', () => {
  it('only stamps cells within the inset field', () => {
    const dims = { cols: 24, rows: 24 };
    const grid = new Uint8Array(dims.cols * dims.rows);
    const next = spawnFillers(grid, dims, PATTERNS, 5, () => 0.42);
    expect([...grid]).toEqual([...new Uint8Array(grid.length)]);
    for (const [x, y] of liveCells(next, dims.cols)) expect(inField(x, y, dims)).toBe(true);
  });
});

describe('spawnGliders', () => {
  it('avoids stamping on top of the snake', () => {
    const dims = { cols: 24, rows: 24 };
    const grid = new Uint8Array(dims.cols * dims.rows);
    const snake = [{ c: 12, r: 12 }];
    const next = spawnGliders(grid, dims, PATTERNS.glider, snake, 3);
    expect([...grid]).toEqual([...new Uint8Array(grid.length)]);
    for (const [x, y] of liveCells(next, dims.cols)) {
      expect(snake.some((s) => s.c === x && s.r === y)).toBe(false);
    }
  });
});

describe('computeColors', () => {
  it('gives a larger cluster a higher hue/lightness than an isolated cell', () => {
    const dims = { cols: 10, rows: 10 };
    const grid = makeGrid(10, 10, [
      [2, 2],
      [3, 3],
      [3, 2],
      [2, 3],
      [8, 8],
    ]);
    const { hueBuf } = computeColors(grid, dims);
    const blockHue = hueBuf[2 * 10 + 2];
    const loneHue = hueBuf[8 * 10 + 8];
    expect(blockHue).toBeGreaterThan(loneHue);
    expect(loneHue).toBe(222);
  });
});

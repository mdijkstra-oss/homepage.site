import { describe, expect, it } from 'vitest';
import { computeColors, inField, nextStaleCount, seedLife, shouldReseed, spawnFillers, spawnGliders, stepLife } from './life';
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
    ['top-left corner of the inset', 1, 2, true],
    ['bottom-right corner of the inset', 8, 6, true],
    ['left edge excluded', 0, 5, false],
    ['top edge excluded', 5, 1, false],
    ['right edge excluded', 9, 5, false],
    ['bottom edge excluded', 5, 7, false],
  ] as const)('%s', (_label, x, y, expected) => {
    expect(inField(x, y, dims)).toBe(expected);
  });
});

describe('stepLife', () => {
  it('keeps a still life (2x2 block) unchanged', () => {
    const dims = { cols: 10, rows: 10 };
    const grid = makeGrid(10, 10, [[4, 4], [5, 4], [4, 5], [5, 5]]);
    const { grid: next } = stepLife(grid, dims);
    expect(liveCells(next, 10).sort()).toEqual([[4, 4], [4, 5], [5, 4], [5, 5]].sort());
  });

  it('oscillates a blinker between horizontal and vertical', () => {
    const dims = { cols: 10, rows: 10 };
    const horizontal = makeGrid(10, 10, [[3, 5], [4, 5], [5, 5]]);
    const step1 = stepLife(horizontal, dims);
    expect(liveCells(step1.grid, 10).sort()).toEqual([[4, 4], [4, 5], [4, 6]].sort());
    const step2 = stepLife(step1.grid, dims);
    expect(liveCells(step2.grid, 10).sort()).toEqual([[3, 5], [4, 5], [5, 5]].sort());
  });

  it('translates a glider by (1,1) after 4 steps', () => {
    const dims = { cols: 20, rows: 20 };
    let grid = makeGrid(20, 20, PATTERNS.glider.map(([x, y]) => [x + 5, y + 5] as [number, number]));
    for (let i = 0; i < 4; i++) grid = stepLife(grid, dims).grid;
    const expected = PATTERNS.glider.map(([x, y]) => [x + 6, y + 6] as [number, number]);
    expect(liveCells(grid, 20).sort()).toEqual(expected.sort());
  });

  it('kills an overcrowded cell and starves an isolated one', () => {
    const dims = { cols: 10, rows: 10 };
    // centre cell has 4 live neighbours -> dies; corner-ish cell has 0 -> stays dead
    const grid = makeGrid(10, 10, [[4, 4], [4, 5], [4, 3], [3, 4], [5, 4]]);
    const { grid: next } = stepLife(grid, dims);
    expect(next[4 * 10 + 4]).toBe(0);
  });

  it('suppresses birth outside the inset field even with 3 neighbours', () => {
    const dims = { cols: 10, rows: 10 };
    // (0,5) would be born (3 neighbours) but x=0 is outside inField's inset.
    const grid = makeGrid(10, 10, [[1, 4], [1, 5], [1, 6]]);
    const { grid: next } = stepLife(grid, dims);
    expect(next[5 * 10 + 0]).toBe(0);
  });
});

describe('seedLife', () => {
  it('is deterministic for a fixed rng and stays within the inset field', () => {
    const dims = { cols: 24, rows: 24 };
    const rngSeq = () => {
      let s = 1;
      return () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
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
    [3, 0, 1],
    [3, 4, 5],
    [20, 5, 0],
  ])('alive=%i, prevStale=%i -> %i', (alive, prevStale, expected) => {
    expect(nextStaleCount(alive, prevStale)).toBe(expected);
  });
});

describe('shouldReseed', () => {
  const dims = { cols: 20, rows: 20 };
  it.each([
    ['too many stale rounds', 10, dims, 3, 10, true],
    ['overcrowded', 200, dims, 0, 10, true],
    ['generation ceiling hit', 10, dims, 0, 461, true],
    ['healthy grid', 50, dims, 0, 10, false],
  ] as const)('%s', (_label, alive, d, stale, gen, expected) => {
    expect(shouldReseed(alive, d, stale, gen)).toBe(expected);
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
    const grid = makeGrid(10, 10, [[2, 2], [3, 3], [3, 2], [2, 3], [8, 8]]); // 2x2 block + lone cell
    const { hueBuf } = computeColors(grid, dims);
    const blockHue = hueBuf[2 * 10 + 2];
    const loneHue = hueBuf[8 * 10 + 8];
    expect(blockHue).toBeGreaterThan(loneHue);
    expect(loneHue).toBe(222); // baseline hue for a cluster of size 1
  });
});

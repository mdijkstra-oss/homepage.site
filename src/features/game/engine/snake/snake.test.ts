import { describe, expect, it } from 'vitest';
import { cellAt, nextPendingDir, nextSnakeInterval, type SnakeCell, spawnSnakeAt, stepSnake } from './snake';

const noFood = () => 0;

describe('spawnSnakeAt', () => {
  it.each([
    { name: 'wide playfield', cols: 40, rows: 30 },
    { name: 'square playfield', cols: 10, rows: 10 },
    { name: 'minimum comfortable playfield', cols: 8, rows: 8 },
  ])('places a 5-segment snake facing right within $name', ({ cols, rows }) => {
    const { snake, dir } = spawnSnakeAt(cols, rows);
    expect(snake).toHaveLength(5);
    expect(dir).toEqual({ dc: 1, dr: 0 });
    for (const { c, r } of snake) {
      expect(c).toBeGreaterThanOrEqual(0);
      expect(c).toBeLessThan(cols);
      expect(r).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThan(rows);
    }
  });
});

describe('stepSnake', () => {
  const cols = 10,
    rows = 10;
  const snake: SnakeCell[] = [
    { c: 5, r: 5 },
    { c: 4, r: 5 },
    { c: 3, r: 5 },
  ];

  it('moves forward and drops the tail when there is no food', () => {
    const result = stepSnake(snake, { dc: 1, dr: 0 }, cols, rows, noFood);
    expect(result).toEqual({
      kind: 'moved',
      snake: [
        { c: 6, r: 5 },
        { c: 5, r: 5 },
        { c: 4, r: 5 },
      ],
    });
  });

  it('grows and reports the eaten index when food is visible', () => {
    const result = stepSnake(snake, { dc: 1, dr: 0 }, cols, rows, (idx) => (idx === 5 * cols + 6 ? 1 : 0));
    expect(result.kind).toBe('ate');
    if (result.kind === 'ate') {
      expect(result.snake).toEqual([
        { c: 6, r: 5 },
        { c: 5, r: 5 },
        { c: 4, r: 5 },
        { c: 3, r: 5 },
      ]);
      expect(result.ateIndex).toBe(5 * cols + 6);
    }
  });

  it('dies when the next head position overlaps its body', () => {
    const loop: SnakeCell[] = [
      { c: 5, r: 5 },
      { c: 5, r: 6 },
      { c: 6, r: 6 },
      { c: 6, r: 5 },
    ];
    const result = stepSnake(loop, { dc: 0, dr: 1 }, cols, rows, noFood);
    expect(result).toEqual({ kind: 'died' });
  });

  it('wraps around both axes', () => {
    const atRightEdge: SnakeCell[] = [{ c: cols - 1, r: 5 }];
    expect(stepSnake(atRightEdge, { dc: 1, dr: 0 }, cols, rows, noFood)).toEqual({
      kind: 'moved',
      snake: [{ c: 0, r: 5 }],
    });
    const atBottomEdge: SnakeCell[] = [{ c: 5, r: rows - 1 }];
    expect(stepSnake(atBottomEdge, { dc: 0, dr: 1 }, cols, rows, noFood)).toEqual({
      kind: 'moved',
      snake: [{ c: 5, r: 0 }],
    });
  });
});

describe('nextPendingDir', () => {
  const right = { dc: 1, dr: 0 };
  it.each([
    { name: 'rejects the exact reversal', key: 'arrowleft', current: right, expected: null },
    { name: 'accepts a perpendicular turn', key: 'arrowup', current: right, expected: { dc: 0, dr: -1 } },
    { name: 'accepts continuing the same direction', key: 'arrowright', current: right, expected: { dc: 1, dr: 0 } },
    { name: 'ignores unrelated keys', key: 'escape', current: right, expected: null },
  ] as const)('$name', ({ key, current, expected }) => {
    expect(nextPendingDir(key, current)).toEqual(expected);
  });
});

describe('cellAt', () => {
  it.each([
    { name: 'inside the grid', x: 45, y: 65, size: 30, cols: 10, rows: 10, expected: { c: 1, r: 2 } },
    { name: 'clamps negative coordinates', x: -50, y: -50, size: 30, cols: 10, rows: 10, expected: { c: 0, r: 0 } },
    { name: 'clamps past the far edge', x: 9999, y: 9999, size: 30, cols: 10, rows: 10, expected: { c: 9, r: 9 } },
  ] as const)('$name', ({ x, y, size, cols, rows, expected }) => {
    expect(cellAt(x, y, size, cols, rows)).toEqual(expected);
  });
});

describe('nextSnakeInterval', () => {
  const cfg = {
    initialStepMs: 150,
    minimumStepMs: 60,
    stepReductionPerPointMs: 3,
    cellGapPx: 4,
    pickupParticleCount: 40,
    pickupParticleSpeed: 0.7,
  };
  it.each([
    { name: 'uses initial speed before scoring', score: 0, expected: 150 },
    { name: 'subtracts configured reduction per point', score: 10, expected: 120 },
    { name: 'stops at the configured minimum', score: 1000, expected: 60 },
  ])('$name', ({ score, expected }) => {
    expect(nextSnakeInterval(cfg, score)).toBe(expected);
  });
});

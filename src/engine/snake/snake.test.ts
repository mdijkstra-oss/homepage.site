import { describe, expect, it } from 'vitest';
import { cellAt, nextPendingDir, nextSnakeInterval, spawnSnakeAt, stepSnake, type SnakeCell } from './snake';

const noFood = () => 0;

describe('spawnSnakeAt', () => {
  it.each([
    [40, 30],
    [10, 10],
    [8, 8],
  ])('places a 5-segment snake facing right within a %ix%i grid', (cols, rows) => {
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
  const cols = 10, rows = 10;
  const snake: SnakeCell[] = [{ c: 5, r: 5 }, { c: 4, r: 5 }, { c: 3, r: 5 }];

  it('moves forward and drops the tail when there is no food', () => {
    const result = stepSnake(snake, { dc: 1, dr: 0 }, cols, rows, noFood);
    expect(result).toEqual({ kind: 'moved', snake: [{ c: 6, r: 5 }, { c: 5, r: 5 }, { c: 4, r: 5 }] });
  });

  it('grows and reports the eaten index when food is visible', () => {
    const result = stepSnake(snake, { dc: 1, dr: 0 }, cols, rows, (idx) => (idx === 5 * cols + 6 ? 1 : 0));
    expect(result.kind).toBe('ate');
    if (result.kind === 'ate') {
      expect(result.snake).toEqual([{ c: 6, r: 5 }, { c: 5, r: 5 }, { c: 4, r: 5 }, { c: 3, r: 5 }]);
      expect(result.ateIndex).toBe(5 * cols + 6);
    }
  });

  it('dies on self-collision', () => {
    // head moving down lands on a body segment that survives the tail-drop.
    const loop: SnakeCell[] = [{ c: 5, r: 5 }, { c: 5, r: 6 }, { c: 6, r: 6 }, { c: 6, r: 5 }];
    const result = stepSnake(loop, { dc: 0, dr: 1 }, cols, rows, noFood);
    expect(result).toEqual({ kind: 'died' });
  });

  it('wraps around both axes', () => {
    const atRightEdge: SnakeCell[] = [{ c: cols - 1, r: 5 }];
    expect(stepSnake(atRightEdge, { dc: 1, dr: 0 }, cols, rows, noFood)).toEqual({ kind: 'moved', snake: [{ c: 0, r: 5 }] });
    const atBottomEdge: SnakeCell[] = [{ c: 5, r: rows - 1 }];
    expect(stepSnake(atBottomEdge, { dc: 0, dr: 1 }, cols, rows, noFood)).toEqual({ kind: 'moved', snake: [{ c: 5, r: 0 }] });
  });
});

describe('nextPendingDir', () => {
  const right = { dc: 1, dr: 0 };
  it.each([
    ['rejects the exact reversal', 'arrowleft', right, null],
    ['accepts a perpendicular turn', 'arrowup', right, { dc: 0, dr: -1 }],
    ['accepts continuing the same direction', 'arrowright', right, { dc: 1, dr: 0 }],
    ['ignores unrelated keys', 'escape', right, null],
  ] as const)('%s', (_label, key, current, expected) => {
    expect(nextPendingDir(key, current)).toEqual(expected);
  });
});

describe('cellAt', () => {
  it.each([
    ['inside the grid', 45, 65, 30, 10, 10, { c: 1, r: 2 }],
    ['clamps negative coordinates', -50, -50, 30, 10, 10, { c: 0, r: 0 }],
    ['clamps past the far edge', 9999, 9999, 30, 10, 10, { c: 9, r: 9 }],
  ] as const)('%s', (_label, x, y, size, cols, rows, expected) => {
    expect(cellAt(x, y, size, cols, rows)).toEqual(expected);
  });
});

describe('nextSnakeInterval', () => {
  const cfg = { snakeBase: 150, snakeMin: 60, snakeRamp: 3, snakeGap: 4, eatParticles: 40, eatPower: 0.7 };
  it.each([
    [0, 150],
    [10, 120],
    [1000, 60], // clamped to snakeMin
  ])('score %i -> interval %i', (score, expected) => {
    expect(nextSnakeInterval(cfg, score)).toBe(expected);
  });
});

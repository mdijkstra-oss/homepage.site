export type Cell = readonly [x: number, y: number];

export type PatternName = 'blinker' | 'glider' | 'toad' | 'beacon' | 'pulsar' | 'penta' | 'gun';

export type PatternTable = Readonly<Record<PatternName, ReadonlyArray<Cell>>>;

export const PATTERNS: PatternTable = {
  blinker: [[0, 0], [1, 0], [2, 0]],
  glider: [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]],
  toad: [[1, 0], [2, 0], [3, 0], [0, 1], [1, 1], [2, 1]],
  beacon: [[0, 0], [1, 0], [0, 1], [3, 2], [2, 3], [3, 3]],
  pulsar: [
    [2, 0], [3, 0], [4, 0], [8, 0], [9, 0], [10, 0],
    [0, 2], [5, 2], [7, 2], [12, 2], [0, 3], [5, 3], [7, 3], [12, 3], [0, 4], [5, 4], [7, 4], [12, 4],
    [2, 5], [3, 5], [4, 5], [8, 5], [9, 5], [10, 5],
    [2, 7], [3, 7], [4, 7], [8, 7], [9, 7], [10, 7],
    [0, 8], [5, 8], [7, 8], [12, 8], [0, 9], [5, 9], [7, 9], [12, 9], [0, 10], [5, 10], [7, 10], [12, 10],
    [2, 12], [3, 12], [4, 12], [8, 12], [9, 12], [10, 12],
  ],
  penta: [[0, 1], [1, 1], [2, 0], [2, 2], [3, 1], [4, 1], [5, 1], [6, 1], [7, 0], [7, 2], [8, 1], [9, 1]],
  gun: [
    [1, 5], [1, 6], [2, 5], [2, 6], [11, 5], [11, 6], [11, 7], [12, 4], [12, 8], [13, 3], [13, 9], [14, 3], [14, 9],
    [15, 6], [16, 4], [16, 8], [17, 5], [17, 6], [17, 7], [18, 6], [21, 3], [21, 4], [21, 5], [22, 3], [22, 4],
    [22, 5], [23, 2], [23, 6], [25, 1], [25, 2], [25, 6], [25, 7], [35, 3], [35, 4], [36, 3], [36, 4],
  ],
} as const;

export function patternDims(cells: ReadonlyArray<Cell>): { w: number; h: number } {
  let mx = 0, my = 0;
  for (const [x, y] of cells) { if (x > mx) mx = x; if (y > my) my = y; }
  return { w: mx + 1, h: my + 1 };
}

export function resolvePattern(
  cells: ReadonlyArray<Cell>, ox: number, oy: number, flipX: boolean, flipY: boolean,
): Cell[] {
  return cells.map(([px, py]) => transformPatternCell(px, py, ox, oy, flipX, flipY));
}

export function patternFits(
  cells: ReadonlyArray<Cell>, ox: number, oy: number, flipX: boolean, flipY: boolean,
  cols: number, rows: number,
): boolean {
  return resolvePattern(cells, ox, oy, flipX, flipY).every(([x, y]) => x >= 0 && x < cols && y >= 0 && y < rows);
}

export function stampPattern(
  grid: Uint8Array, cols: number,
  cells: ReadonlyArray<Cell>, ox: number, oy: number, flipX: boolean, flipY: boolean,
): Uint8Array {
  const next = grid.slice();
  const rows = next.length / cols;
  for (const [x, y] of resolvePattern(cells, ox, oy, flipX, flipY)) {
    if (x >= 0 && x < cols && y >= 0 && y < rows) next[y * cols + x] = 1;
  }
  return next;
}

function transformPatternCell(px: number, py: number, ox: number, oy: number, flipX: boolean, flipY: boolean): Cell {
  return [ox + (flipX ? -px : px), oy + (flipY ? -py : py)];
}

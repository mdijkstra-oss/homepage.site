import { clamp } from '../../lib/clamp';
import { type Cell, type PatternName, type PatternTable, resolvePattern, stampPattern } from './patterns';

export interface GolConfig {
  opacity: number;
  generationFadeMs: number;
  generationWaitMs: number;
}

export interface GolDims {
  cols: number;
  rows: number;
}

const SEED_NAMES: readonly PatternName[] = [
  'glider',
  'blinker',
  'toad',
  'beacon',
  'pulsar',
  'penta',
  'glider',
  'blinker',
  'toad',
];
const STALE_RESEED_ROUNDS = 2;
const CROWDED_RESEED_RATIO = 0.4;
const MAX_GENERATIONS_BEFORE_RESEED = 460;

export function inField(x: number, y: number, dims: GolDims): boolean {
  return x >= 1 && x <= dims.cols - 2 && y >= 2 && y <= dims.rows - 4;
}

export function stepLife(grid: Uint8Array, dims: GolDims): { grid: Uint8Array; alive: number } {
  const { cols: C, rows: R } = dims;
  const g = grid,
    n = new Uint8Array(C * R);
  let alive = 0;
  for (let y = 0; y < R; y++) {
    for (let x = 0; x < C; x++) {
      let s = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue;
          const nx = x + dx,
            ny = y + dy;
          if (nx >= 0 && nx < C && ny >= 0 && ny < R) s += g[ny * C + nx];
        }
      }
      const cur = g[y * C + x];
      let nv = (cur && (s === 2 || s === 3)) || (!cur && s === 3) ? 1 : 0;
      if (nv && !inField(x, y, dims)) nv = 0;
      n[y * C + x] = nv;
      alive += nv;
    }
  }
  return { grid: n, alive };
}

export function nextStaleCount(alive: number, prevStale: number): number {
  return alive < 8 ? prevStale + 1 : 0;
}

export function shouldReseed(alive: number, dims: GolDims, staleRounds: number, gen: number): boolean {
  const crowded = alive > dims.cols * dims.rows * CROWDED_RESEED_RATIO;
  return staleRounds > STALE_RESEED_ROUNDS || crowded || gen > MAX_GENERATIONS_BEFORE_RESEED;
}

function placeRandomFiller(
  grid: Uint8Array,
  dims: GolDims,
  patterns: PatternTable,
  count: number,
  maxTries: number,
  rng: () => number,
): Uint8Array {
  const { cols: C, rows: R } = dims;
  let next = grid;
  let placed = 0,
    tries = 0;
  while (placed < count && tries < maxTries) {
    tries++;
    const pattern = patterns[SEED_NAMES[(rng() * SEED_NAMES.length) | 0]];
    const flipX = rng() < 0.5,
      flipY = rng() < 0.5;
    const ox = 1 + ((rng() * (C - 2)) | 0);
    const oy = 2 + ((rng() * (R - 6)) | 0);
    if (!resolvePattern(pattern, ox, oy, flipX, flipY).every(([x, y]) => inField(x, y, dims))) continue;
    next = stampPattern(next, C, pattern, ox, oy, flipX, flipY);
    placed++;
  }
  return next;
}

export function seedLife(dims: GolDims, patterns: PatternTable, rng: () => number = Math.random): Uint8Array {
  const { cols: C, rows: R } = dims;
  const grid = new Uint8Array(C * R);
  const target = clamp(Math.round((C * R) / 55), 16, 60);
  const seeded = placeRandomFiller(grid, dims, patterns, target, target * 14, rng);
  for (let y = 2; y <= R - 4; y++) {
    for (let x = 1; x <= C - 2; x++) {
      if (rng() < 0.07) seeded[y * C + x] = 1;
    }
  }
  return seeded;
}

export function spawnFillers(
  grid: Uint8Array,
  dims: GolDims,
  patterns: PatternTable,
  count: number,
  rng: () => number = Math.random,
): Uint8Array {
  return placeRandomFiller(grid, dims, patterns, count, count * 16, rng);
}

export function spawnGliders(
  grid: Uint8Array,
  dims: GolDims,
  glider: ReadonlyArray<Cell>,
  snake: ReadonlyArray<{ c: number; r: number }> | null,
  count: number,
  rng: () => number = Math.random,
): Uint8Array {
  const { cols: C, rows: R } = dims;
  let next = grid;
  const head = snake?.[0];
  let placed = 0,
    tries = 0;
  while (placed < count && tries < 50) {
    tries++;
    const flipX = rng() < 0.5,
      flipY = rng() < 0.5;
    const ox = 2 + ((rng() * (C - 6)) | 0);
    const oy = 3 + ((rng() * (R - 9)) | 0);
    if (head && Math.abs(ox - head.c) + Math.abs(oy - head.r) < 11) continue;
    const cells = resolvePattern(glider, ox, oy, flipX, flipY);
    if (cells.some(([x, y]) => !inField(x, y, dims) || snake?.some((s) => s.c === x && s.r === y))) continue;
    next = stampPattern(next, C, glider, ox, oy, flipX, flipY);
    placed++;
  }
  return next;
}

export function computeColors(grid: Uint8Array, dims: GolDims): { hueBuf: Float32Array; lightBuf: Float32Array } {
  const { cols: C, rows: R } = dims,
    N = C * R;
  const labelBuf = new Int32Array(N);
  const stackBuf = new Int32Array(N);
  const hueBuf = new Float32Array(N).fill(240);
  const lightBuf = new Float32Array(N).fill(64);
  const sizes = [0];
  let next = 1;
  for (let i = 0; i < N; i++) {
    if (!grid[i] || labelBuf[i]) continue;
    let sp = 0,
      count = 0;
    stackBuf[sp++] = i;
    labelBuf[i] = next;
    while (sp) {
      const idx = stackBuf[--sp];
      count++;
      const x = idx % C,
        y = (idx / C) | 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue;
          const nx = x + dx,
            ny = y + dy;
          if (nx < 0 || nx >= C || ny < 0 || ny >= R) continue;
          const ni = ny * C + nx;
          if (grid[ni] && !labelBuf[ni]) {
            labelBuf[ni] = next;
            stackBuf[sp++] = ni;
          }
        }
      }
    }
    sizes[next++] = count;
  }
  for (let i = 0; i < N; i++) {
    if (!grid[i]) continue;
    const f = Math.min(1, (sizes[labelBuf[i]] - 1) / 9);
    hueBuf[i] = 222 + f * 92;
    lightBuf[i] = 64 + f * 8;
  }
  return { hueBuf, lightBuf };
}

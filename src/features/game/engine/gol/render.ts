import { smoothstep } from '../../../../lib/animation/easing';
import type { GolDims } from './life';

export function sizeLifeCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  cellSize: number,
): GolDims & { vw: number; vh: number } {
  const w = window.innerWidth,
    h = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.ceil(w * dpr);
  canvas.height = Math.ceil(h * dpr);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { cols: Math.ceil(w / cellSize), rows: Math.ceil(h / cellSize), vw: w, vh: h };
}

export function paintLife(
  ctx: CanvasRenderingContext2D,
  grid: Uint8Array,
  prevGrid: Uint8Array,
  dims: GolDims,
  cellSize: number,
  hueBuf: Float32Array,
  lightBuf: Float32Array,
  phase: number,
  viewport: { vw: number; vh: number },
  boosted: boolean,
): void {
  const { cols: C, rows: R } = dims,
    N = C * R;
  const e = smoothstep(phase);
  ctx.clearRect(0, 0, viewport.vw, viewport.vh);
  const boost = boosted ? 3.2 : 1;
  for (let i = 0; i < N; i++) {
    const cur = grid[i] ? 1 : 0,
      prev = prevGrid[i] ? 1 : 0;
    if (!cur && !prev) continue;
    const av = prev + (cur - prev) * e;
    if (av < 0.012) continue;
    const x = i % C,
      y = (i / C) | 0;
    ctx.fillStyle = `hsla(${hueBuf[i]},80%,${lightBuf[i]}%,${(av * 0.2 * boost).toFixed(3)})`;
    ctx.fillRect(x * cellSize + 7, y * cellSize + 7, cellSize - 14, cellSize - 14);
  }
}

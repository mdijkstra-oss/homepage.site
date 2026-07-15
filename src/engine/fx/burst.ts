import { clamp } from '../../lib/clamp';

interface Particle {
  t: 0 | 2;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  w: number;
  len: number;
  flick?: number;
  fspd?: number;
  grav?: number;
}

interface Ring {
  x: number;
  y: number;
  r: number;
  life: number;
  delay: number;
}

interface Glow {
  x: number;
  y: number;
  life: number;
}

export interface BurstOptions {
  sparks?: number;
  stars?: number;
  speed?: number;
  bloom?: boolean;
  flash?: boolean;
  shock?: boolean;
}

export interface BurstState {
  particles: Particle[];
  bloom: Glow | null;
  screenFlash: Glow | null;
  shocks: Ring[];
  dirty: boolean;
  lastTick: number | null;
}

export function createBurstState(): BurstState {
  return { particles: [], bloom: null, screenFlash: null, shocks: [], dirty: false, lastTick: null };
}

export function sizeBurstCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): { bw: number; bh: number } {
  const w = window.innerWidth, h = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.ceil(w * dpr);
  canvas.height = Math.ceil(h * dpr);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { bw: w, bh: h };
}

export function spawnBurst(state: BurstState, x: number, y: number, opts: BurstOptions = {}, rng: () => number = Math.random): void {
  const nSpark = opts.sparks ?? 250;
  const nStar = opts.stars ?? 80;
  const spd = opts.speed ?? 1;
  for (let i = 0; i < nSpark; i++) {
    const a = rng() * Math.PI * 2, sp = (12 + Math.pow(rng(), 0.5) * 52) * spd;
    state.particles.push({
      t: 0, x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
      life: 1, decay: 0.55 + rng() * 0.85, w: 0.6 + rng() * 1.6, len: 1.1 + rng() * 1.7,
      flick: rng() * Math.PI * 2, fspd: 0.03 + rng() * 0.09, grav: 0.09,
    });
  }
  for (let i = 0; i < nStar; i++) {
    const a = rng() * Math.PI * 2, sp = (22 + rng() * 62) * spd;
    state.particles.push({
      t: 2, x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
      life: 1, decay: 0.9 + rng() * 1.1, w: 0.4 + rng() * 0.8, len: 1.5 + rng() * 2.0, grav: 0.07,
    });
  }
  if (opts.bloom !== false) state.bloom = { x, y, life: 1 };
  if (opts.flash !== false) state.screenFlash = { x, y, life: 1 };
  if (opts.shock !== false) {
    state.shocks = [
      { x, y, r: 4, life: 1, delay: 0 },
      { x, y, r: 4, life: 1, delay: 0.05 },
      { x, y, r: 4, life: 1, delay: 0.12 },
    ];
  }
}

function isBurstActive(state: BurstState, gameActive: boolean): boolean {
  const hasBurst = state.particles.length > 0 || state.bloom !== null || state.screenFlash !== null || state.shocks.length > 0;
  return hasBurst || gameActive;
}

function stepBurstParticles(particles: readonly Particle[], dt: number, f: number): Particle[] {
  const kept: Particle[] = [];
  for (const p of particles) {
    const drag = p.t === 2 ? 0.965 : 0.95;
    const vx = p.vx * Math.pow(drag, f);
    const vy = p.vy * Math.pow(drag, f) + (p.grav ?? 0.28) * f;
    const life = p.life - p.decay * dt;
    if (life <= 0) continue;
    kept.push({ ...p, vx, vy, x: p.x + vx * f, y: p.y + vy * f, life });
  }
  return kept;
}

function drawBurstParticles(ctx: CanvasRenderingContext2D, particles: readonly Particle[], now: number): void {
  for (const p of particles) {
    const sp = Math.hypot(p.vx, p.vy);
    const trail = clamp(sp * p.len * 1.6, 2, 52);
    const inv = sp > 0.001 ? 1 / sp : 0;
    const tx = p.x - p.vx * inv * trail, ty = p.y - p.vy * inv * trail;
    const flick = p.fspd ? 0.55 + 0.45 * Math.sin(now * p.fspd + (p.flick ?? 0)) : 1;
    const alpha = clamp(p.life, 0, 1) * flick;
    const L = 46 + p.life * 44, H = 16 + p.life * 28;

    ctx.globalAlpha = alpha * 0.13;
    ctx.strokeStyle = `hsl(${(H + 4).toFixed(0)},100%,54%)`;
    ctx.lineWidth = p.w * 11 * (0.5 + p.life);
    ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(p.x, p.y); ctx.stroke();

    ctx.globalAlpha = alpha * 0.42;
    ctx.strokeStyle = `hsl(${H.toFixed(0)},100%,60%)`;
    ctx.lineWidth = p.w * 4.8 * (0.45 + p.life);
    ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(p.x, p.y); ctx.stroke();

    ctx.globalAlpha = alpha;
    ctx.strokeStyle = `hsl(${H.toFixed(0)},100%,${L.toFixed(0)}%)`;
    ctx.lineWidth = p.w * (0.4 + p.life * 0.9);
    ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(p.x, p.y); ctx.stroke();

    ctx.globalAlpha = alpha;
    ctx.fillStyle = `hsl(${(H + 16).toFixed(0)},100%,${Math.min(96, L + 26).toFixed(0)}%)`;
    ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(0.4, p.w * 0.75 * (0.4 + p.life)), 0, Math.PI * 2); ctx.fill();
  }
}

function stepAndDrawScreenFlash(ctx: CanvasRenderingContext2D, flash: Glow | null, dt: number, dims: { bw: number; bh: number }): Glow | null {
  if (!flash) return null;
  const life = flash.life - 2.4 * dt;
  if (life <= 0) return null;
  const next = { ...flash, life };
  const g = ctx.createRadialGradient(next.x, next.y, 0, next.x, next.y, Math.max(dims.bw, dims.bh) * 1.1);
  g.addColorStop(0, `rgba(255,172,82,${(0.38 * life).toFixed(3)})`);
  g.addColorStop(0.55, `rgba(255,120,46,${(0.17 * life).toFixed(3)})`);
  g.addColorStop(1, 'rgba(255,110,36,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, dims.bw, dims.bh);
  ctx.fillStyle = `rgba(255,138,58,${(0.06 * life).toFixed(3)})`;
  ctx.fillRect(0, 0, dims.bw, dims.bh);
  return next;
}

function stepAndDrawBloom(ctx: CanvasRenderingContext2D, bloom: Glow | null, dt: number): Glow | null {
  if (!bloom) return null;
  const life = bloom.life - 1.5 * dt;
  if (life <= 0) return null;
  const next = { ...bloom, life };
  const r = 30 + (1 - life) * 170;
  const g = ctx.createRadialGradient(next.x, next.y, 0, next.x, next.y, r);
  g.addColorStop(0, `rgba(255,246,220,${(0.6 * life).toFixed(3)})`);
  g.addColorStop(0.35, `rgba(255,176,86,${(0.4 * life).toFixed(3)})`);
  g.addColorStop(1, 'rgba(255,120,40,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(next.x, next.y, r, 0, Math.PI * 2); ctx.fill();
  return next;
}

function stepAndDrawShocks(ctx: CanvasRenderingContext2D, shocks: readonly Ring[], dt: number): Ring[] {
  const kept: Ring[] = [];
  for (const s of shocks) {
    if (s.delay > 0) { kept.push({ ...s, delay: s.delay - dt }); continue; }
    const r = s.r + 560 * dt, life = s.life - 2.0 * dt;
    if (life <= 0) continue;
    const next = { ...s, r, life, delay: 0 };
    kept.push(next);
    ctx.globalAlpha = clamp(life * 0.55, 0, 1);
    ctx.lineWidth = 2.5 * life + 0.5;
    ctx.strokeStyle = 'hsl(32,100%,64%)';
    ctx.beginPath(); ctx.arc(next.x, next.y, r, 0, Math.PI * 2); ctx.stroke();
  }
  return kept;
}

export function tickBurst(
  ctx: CanvasRenderingContext2D,
  state: BurstState,
  now: number,
  dims: { bw: number; bh: number },
  gameActive: boolean,
  drawUnderlay: ((ctx: CanvasRenderingContext2D, now: number) => void) | null,
): void {
  if (!isBurstActive(state, gameActive)) {
    if (state.dirty) { ctx.clearRect(0, 0, dims.bw, dims.bh); state.dirty = false; }
    return;
  }
  state.dirty = true;
  let dt = (now - (state.lastTick ?? now)) / 1000;
  state.lastTick = now;
  if (dt > 0.05 || dt < 0) dt = 0.016;
  const f = dt * 60;

  ctx.clearRect(0, 0, dims.bw, dims.bh);
  drawUnderlay?.(ctx, now);
  ctx.globalCompositeOperation = 'lighter';
  ctx.lineCap = 'round';

  state.screenFlash = stepAndDrawScreenFlash(ctx, state.screenFlash, dt, dims);
  state.bloom = stepAndDrawBloom(ctx, state.bloom, dt);
  state.shocks = stepAndDrawShocks(ctx, state.shocks, dt);
  state.particles = stepBurstParticles(state.particles, dt, f);
  drawBurstParticles(ctx, state.particles, now);

  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
}

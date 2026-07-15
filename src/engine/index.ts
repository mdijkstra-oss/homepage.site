import type { BlockType } from '../types/blocks';
import type { BreakPillStatus, EngineHandle, GamePhase, GameStatus } from '../types/engine';
import { readConfig, type EngineConfig, type EngineProps } from './config';
import { clamp } from '../lib/clamp';
import { createForeground } from './foreground/foreground';
import { smoothstep } from '../lib/easing';
import { installKonami } from './konami';
import { createBurstState, spawnBurst, sizeBurstCanvas, tickBurst } from './fx/burst';
import { computeColors, nextStaleCount, seedLife, shouldReseed, spawnFillers, spawnGliders, stepLife, type GolDims } from './gol/life';
import { paintLife, sizeLifeCanvas } from './gol/render';
import { PATTERNS } from './gol/patterns';
import { isDirectionKey, nextPendingDir, nextSnakeInterval, spawnSnakeAt, stepSnake, type Dir, type SnakeCell } from './snake/snake';
import { cutSnakeArrow, drawSnakeBody, countdownArrowAlpha, playArrowAlpha } from './snake/render';
import { loadBestScore, saveBestScore } from './snake/score';

const CELL = 30;
const COUNTDOWN_STEPS = ['3', '2', '1', 'GO'] as const;

export function createSiteEngine(props: EngineProps, blockOrder: readonly BlockType[]): EngineHandle {
  const cfg: EngineConfig = readConfig(props);

  let root: HTMLElement | null = null;
  let foreground: ReturnType<typeof createForeground> | null = null;
  let raf = 0;
  let lastLoopAt = 0;

  // ---- Game of Life background ----
  let golCanvas: HTMLCanvasElement | null = null;
  let golCtx: CanvasRenderingContext2D | null = null;
  let grid = new Uint8Array(0);
  let prevGrid = new Uint8Array(0);
  let hueBuf = new Float32Array(0);
  let lightBuf = new Float32Array(0);
  let golDims: GolDims = { cols: 0, rows: 0 };
  let golViewport = { vw: 0, vh: 0 };
  let phase = 0;
  let waitAcc = 0;
  let golLast = 0;
  let gen = 0;
  let staleRounds = 0;
  let aliveCount = 0;
  let golTimer: ReturnType<typeof setInterval> | null = null;
  const fadeMs = Math.max(40, cfg.gol.golFade);
  const waitMs = Math.max(0, cfg.gol.golWait);

  // ---- particle burst ----
  let burstCanvas: HTMLCanvasElement | null = null;
  let burstCtx: CanvasRenderingContext2D | null = null;
  let burstDims = { bw: 0, bh: 0 };
  const burstState = createBurstState();

  // ---- snake minigame ----
  let game: GamePhase = null;
  let snake: SnakeCell[] = [];
  let dir: Dir = { dc: 1, dr: 0 };
  let pendingDir: Dir = { dc: 1, dr: 0 };
  let score = 0;
  let best = 0;
  let newBest = false;
  let snakeInterval = cfg.snake.snakeBase;
  let snakeAcc = 0;
  let playAt = 0;
  let countdownLabel: string | null = null;
  let countTimer: ReturnType<typeof setTimeout> | null = null;
  let snakeTimer: ReturnType<typeof setTimeout> | null = null;

  let breakStatusListener: ((status: BreakPillStatus) => void) | null = null;
  let gameStatusListener: ((status: GameStatus) => void) | null = null;
  const disposers: Array<() => void> = [];

  function fireFlyAtCenter(preDelay = 0): void {
    foreground?.fireFly({ x: (window.innerWidth || 1200) / 2, y: (window.innerHeight || 800) / 2 }, preDelay);
  }

  // ---- Game of Life ----

  function sizeGol(): void {
    if (!golCanvas || !golCtx) return;
    const sized = sizeLifeCanvas(golCanvas, golCtx, CELL);
    golDims = { cols: sized.cols, rows: sized.rows };
    golViewport = { vw: sized.vw, vh: sized.vh };
    const N = golDims.cols * golDims.rows;
    if (grid.length !== N) {
      grid = new Uint8Array(N);
      prevGrid = new Uint8Array(N);
      hueBuf = new Float32Array(N).fill(240);
      lightBuf = new Float32Array(N).fill(64);
    }
  }

  function paintGol(): void {
    if (!golCtx) return;
    paintLife(golCtx, grid, prevGrid, golDims, CELL, hueBuf, lightBuf, phase, golViewport, game === 'play' || game === 'countdown');
  }

  function cellVisible(idx: number): number {
    if (!grid.length) return 0;
    const e = smoothstep(phase);
    const cur = grid[idx] ? 1 : 0, prev = prevGrid[idx] ? 1 : 0;
    return prev + (cur - prev) * e;
  }

  function advanceGen(): void {
    prevGrid.set(grid);
    const stepped = stepLife(grid, golDims);
    grid = stepped.grid;
    aliveCount = stepped.alive;
    gen++;
    staleRounds = nextStaleCount(aliveCount, staleRounds);
    if (!game && shouldReseed(aliveCount, golDims, staleRounds, gen)) {
      grid = seedLife(golDims, PATTERNS);
      staleRounds = 0;
      gen = 0;
    }
    if (game === 'play') {
      if (aliveCount < 26) grid = spawnGliders(grid, golDims, PATTERNS.glider, snake, 3);
    } else if (!game || game === 'paused') {
      const lowMark = Math.max(24, Math.round(golDims.cols * golDims.rows * 0.05));
      if (aliveCount < lowMark) grid = spawnFillers(grid, golDims, PATTERNS, clamp(Math.round((lowMark - aliveCount) / 8), 3, 10));
      else if (gen % 36 === 0) grid = spawnFillers(grid, golDims, PATTERNS, 2);
    }
    ({ hueBuf, lightBuf } = computeColors(grid, golDims));
    phase = 0;
  }

  function animLife(): void {
    const now = performance.now();
    let dt = now - golLast;
    golLast = now;
    if (dt > 500) dt = 33;
    if (!grid.length) return;
    if (phase < 1) {
      phase = Math.min(1, phase + dt / fadeMs);
    } else {
      waitAcc += dt;
      if (waitAcc >= waitMs) { waitAcc = 0; advanceGen(); }
    }
    paintGol();
  }

  function initGol(canvas: HTMLElement | null): void {
    if (!(canvas instanceof HTMLCanvasElement)) return;
    golCanvas = canvas;
    golCtx = canvas.getContext('2d');
    if (!golCtx) return;
    sizeGol();
    grid = seedLife(golDims, PATTERNS);
    ({ hueBuf, lightBuf } = computeColors(grid, golDims));
    phase = 0;
    waitAcc = 0;
    golLast = performance.now();
    golCanvas.style.opacity = String(cfg.gol.golOpacity);
    paintGol();
    golTimer = setInterval(animLife, 33);
  }

  // ---- snake minigame ----

  function startGame(): void {
    if (!golDims.cols || !golDims.rows) return;
    const spawned = spawnSnakeAt(golDims.cols, golDims.rows);
    snake = spawned.snake;
    dir = spawned.dir;
    pendingDir = spawned.dir;
    score = 0;
    snakeInterval = cfg.snake.snakeBase;
    snakeAcc = 0;
    best = loadBestScore();
    startCountdown();
  }

  function startCountdown(): void {
    game = 'countdown';
    snakeAcc = 0;
    if (golCanvas) golCanvas.style.opacity = '1';
    notifyBreakStatus();
    let i = 0;
    const run = () => {
      if (game !== 'countdown') return;
      if (i >= COUNTDOWN_STEPS.length) { beginPlay(); return; }
      countdownLabel = COUNTDOWN_STEPS[i];
      notifyGameStatus();
      i++;
      countTimer = setTimeout(run, countdownLabel === 'GO' ? 480 : 640);
    };
    if (countTimer) clearTimeout(countTimer);
    run();
  }

  function beginPlay(): void {
    game = 'play';
    snakeAcc = 0;
    playAt = performance.now();
    countdownLabel = null;
    notifyBreakStatus();
    notifyGameStatus();
  }

  function pauseGame(): void {
    if (game !== 'play' && game !== 'countdown') return;
    if (countTimer) clearTimeout(countTimer);
    game = 'paused';
    countdownLabel = null;
    if (golCanvas) golCanvas.style.opacity = String(cfg.gol.golOpacity);
    notifyBreakStatus();
    notifyGameStatus();
    fireFlyAtCenter();
  }

  function quitGame(): void {
    if (!game) return;
    game = null;
    snake = [];
    if (snakeTimer) clearTimeout(snakeTimer);
    if (countTimer) clearTimeout(countTimer);
    countdownLabel = null;
    if (golCanvas) golCanvas.style.opacity = String(cfg.gol.golOpacity);
    notifyBreakStatus();
    notifyGameStatus();
    paintGol();
    fireFlyAtCenter();
  }

  function snakeDie(): void {
    game = 'dead';
    const head = snake[0];
    spawnBurst(burstState, (head.c + 0.5) * CELL, (head.r + 0.5) * CELL);
    newBest = score > best;
    if (newBest) {
      best = score;
      saveBestScore(best);
    }
    notifyBreakStatus();
    notifyGameStatus();
  }

  function stepSnakeOnce(): void {
    dir = pendingDir;
    const result = stepSnake(snake, dir, golDims.cols, golDims.rows, cellVisible);
    if (result.kind === 'died') { snakeDie(); return; }
    snake = result.snake;
    if (result.kind === 'ate') {
      grid[result.ateIndex] = 0;
      prevGrid[result.ateIndex] = 0;
      score++;
      snakeInterval = nextSnakeInterval(cfg.snake, score);
      const head = snake[0];
      spawnBurst(burstState, (head.c + 0.5) * CELL, (head.r + 0.5) * CELL, {
        sparks: cfg.snake.eatParticles,
        stars: Math.round(cfg.snake.eatParticles * 0.25),
        speed: cfg.snake.eatPower,
        flash: false, shock: false, bloom: false,
      });
      paintGol();
      notifyGameStatus();
    }
  }

  function tickSnake(loopDelta: number): void {
    if (game !== 'play') return;
    snakeAcc += loopDelta;
    let steps = 0;
    while (snakeAcc >= snakeInterval && steps < 4) {
      snakeAcc -= snakeInterval;
      stepSnakeOnce();
      steps++;
      if (game !== 'play') break;
    }
  }

  function gameKey(e: KeyboardEvent): void {
    if (!game) return;
    const key = (e.key || '').toLowerCase();
    if (isDirectionKey(key)) {
      e.preventDefault();
      if (game !== 'play') return;
      const next = nextPendingDir(key, dir);
      if (next) pendingDir = next;
      return;
    }
    if (key === 'escape') {
      e.preventDefault();
      if (game === 'dead') quitGame(); else pauseGame();
      return;
    }
    if ((key === ' ' || key === 'enter') && game === 'dead') {
      e.preventDefault();
      startGame();
    }
  }

  function drawSnakeUnderlay(ctx: CanvasRenderingContext2D, now: number): void {
    if (game !== 'play' && game !== 'countdown') return;
    drawSnakeBody(ctx, snake, CELL, cfg.snake.snakeGap);
    if (game === 'countdown') {
      cutSnakeArrow(ctx, snake[0], dir, CELL, countdownArrowAlpha(now));
    } else if (game === 'play') {
      const alpha = playArrowAlpha(now - playAt);
      if (alpha !== null) cutSnakeArrow(ctx, snake[0], dir, CELL, alpha);
    }
  }

  // ---- break pill status (consumed by a React component, not DOM-driven) ----

  function currentBreakStatus(): BreakPillStatus {
    return { canShow: !game || game === 'paused', label: game === 'paused' ? 'Resume game' : 'Take a break' };
  }

  function currentGameStatus(): GameStatus {
    return { phase: game, score, best: Math.max(best, score), newBest, countdownLabel };
  }

  function notifyBreakStatus(): void {
    breakStatusListener?.(currentBreakStatus());
  }

  function onBreakStatusChange(cb: (status: BreakPillStatus) => void): () => void {
    breakStatusListener = cb;
    cb(currentBreakStatus());
    return () => { if (breakStatusListener === cb) breakStatusListener = null; };
  }

  function notifyGameStatus(): void {
    gameStatusListener?.(currentGameStatus());
  }

  function onGameStatusChange(cb: (status: GameStatus) => void): () => void {
    gameStatusListener = cb;
    cb(currentGameStatus());
    return () => { if (gameStatusListener === cb) gameStatusListener = null; };
  }

  function triggerBreakPill(origin: { x: number; y: number }): void {
    if (game && game !== 'paused') return;
    if (game === 'paused') {
      fireFlyAtCenter(40);
      if (snakeTimer) clearTimeout(snakeTimer);
      snakeTimer = setTimeout(startCountdown, 260);
      return;
    }
    spawnBurst(burstState, origin.x, origin.y);
    fireFlyAtCenter(40);
    if (snakeTimer) clearTimeout(snakeTimer);
    snakeTimer = setTimeout(startGame, 380);
  }

  function initInteractive(r: HTMLElement): void {
    burstCanvas = r.querySelector('[data-burst]');
    if (burstCanvas) {
      burstCtx = burstCanvas.getContext('2d');
      if (burstCtx) burstDims = sizeBurstCanvas(burstCanvas, burstCtx);
    }

    window.addEventListener('keydown', gameKey);
    disposers.push(() => window.removeEventListener('keydown', gameKey));
  }

  // ---- resize / lifecycle ----

  function onResize(): void {
    if (golCanvas) { sizeGol(); paintGol(); }
    if (burstCanvas && burstCtx) burstDims = sizeBurstCanvas(burstCanvas, burstCtx);
  }

  function jumpToType(type: BlockType): void {
    let n = 0;
    for (let i = 0; i < blockOrder.length; i++) {
      if (blockOrder[i] === type) { n = i; break; }
    }
    if (n > 0 && blockOrder[n - 1] === 'user') n--;
    const bubbles = root?.querySelectorAll<HTMLElement>('[data-bubble]');
    const target = bubbles?.[n];
    if (target) {
      const r = target.getBoundingClientRect();
      window.scrollBy({ top: r.top - 120, behavior: 'smooth' });
    }
  }

  function loop(): void {
    const now = performance.now();
    const loopDelta = lastLoopAt ? Math.min(80, now - lastLoopAt) : 16;
    lastLoopAt = now;
    foreground?.tick(now);
    tickSnake(loopDelta);
    if (burstCtx) tickBurst(burstCtx, burstState, now, burstDims, game === 'play' || game === 'countdown', drawSnakeUnderlay);
    raf = requestAnimationFrame(loop);
  }

  function mount(rootEl: HTMLElement): void {
    root = rootEl;
    foreground = createForeground(rootEl, cfg.foreground);
    initGol(rootEl.querySelector('[data-gol]'));
    initInteractive(rootEl);
    disposers.push(installKonami(() => foreground?.toggleFly()));
    window.addEventListener('resize', onResize);
    disposers.push(() => window.removeEventListener('resize', onResize));
    raf = requestAnimationFrame(loop);
  }

  function destroy(): void {
    cancelAnimationFrame(raf);
    if (golTimer) clearInterval(golTimer);
    if (countTimer) clearTimeout(countTimer);
    if (snakeTimer) clearTimeout(snakeTimer);
    disposers.forEach((dispose) => dispose());
    disposers.length = 0;
  }

  return {
    mount,
    destroy,
    jumpToType,
    addBubble: (el) => foreground?.addBubble(el),
    removeBubble: (el) => foreground?.removeBubble(el),
    onBreakStatusChange,
    onGameStatusChange,
    triggerBreakPill,
    restartGame: startGame,
    quitGame,
  };
}

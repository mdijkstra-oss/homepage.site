import { smoothstep } from '../../../lib/animation/easing';
import { selectScrollEasedValue } from '../../../lib/animation/scrollOpacity';
import { clamp } from '../../../lib/clamp';
import { GAME_COPY } from '../copy';
import { createBurstState, sizeBurstCanvas, spawnBurst, tickBurst } from './burst';
import { type EngineConfig, type EngineProps, readConfig } from './config';
import {
  computeColors,
  type GolDims,
  nextStaleCount,
  seedLife,
  shouldReseed,
  spawnFillers,
  spawnGliders,
  stepLife,
} from './gol/life';
import { PATTERNS } from './gol/patterns';
import { paintLife, sizeLifeCanvas } from './gol/render';
import { countdownArrowAlpha, cutSnakeArrow, drawSnakeBody, playArrowAlpha } from './snake/render';
import { loadBestScore, saveBestScore } from './snake/score';
import {
  type Dir,
  isDirectionKey,
  nextPendingDir,
  nextSnakeInterval,
  type SnakeCell,
  spawnSnakeAt,
  stepSnake,
} from './snake/snake';
import { createStatusChannel } from './status';
import type { BreakPillStatus, GameEngineHandle, GamePhase, GameStatus } from './types';

const CELL = 30;
const COUNTDOWN_STEPS = GAME_COPY.countdown.steps;

export function createGameEngine(props: EngineProps): GameEngineHandle {
  const cfg: EngineConfig = readConfig(props);

  let raf = 0;
  let lastLoopAt = 0;

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
  const fadeMs = Math.max(40, cfg.gol.generationFadeMs);
  const waitMs = Math.max(0, cfg.gol.generationWaitMs);

  let burstCanvas: HTMLCanvasElement | null = null;
  let burstCtx: CanvasRenderingContext2D | null = null;
  let burstDims = { bw: 0, bh: 0 };
  const burstState = createBurstState();

  let game: GamePhase = null;
  let snake: SnakeCell[] = [];
  let dir: Dir = { dc: 1, dr: 0 };
  let pendingDir: Dir = { dc: 1, dr: 0 };
  let score = 0;
  let best = 0;
  let newBest = false;
  let snakeInterval = cfg.snake.initialStepMs;
  let snakeAcc = 0;
  let playAt = 0;
  let countdownLabel: string | null = null;
  let countTimer: ReturnType<typeof setTimeout> | null = null;
  let snakeTimer: ReturnType<typeof setTimeout> | null = null;

  const disposers: Array<() => void> = [];
  const breakStatus = createStatusChannel(currentBreakStatus);
  const gameStatus = createStatusChannel(currentGameStatus);

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
    paintLife(
      golCtx,
      grid,
      prevGrid,
      golDims,
      CELL,
      hueBuf,
      lightBuf,
      phase,
      golViewport,
      game === 'play' || game === 'countdown',
    );
  }

  function cellVisible(idx: number): number {
    if (!grid.length) return 0;
    const e = smoothstep(phase);
    const cur = grid[idx] ? 1 : 0,
      prev = prevGrid[idx] ? 1 : 0;
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
      if (aliveCount < lowMark)
        grid = spawnFillers(grid, golDims, PATTERNS, clamp(Math.round((lowMark - aliveCount) / 8), 3, 10));
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
    if (phase >= 1) {
      waitAcc += dt;
      // Between generations the pixels are identical, so painting them again is wasted GPU work.
      if (waitAcc < waitMs) return;
      waitAcc = 0;
      advanceGen();
    }
    phase = Math.min(1, phase + dt / fadeMs);
    paintGol();
  }

  function shouldUseFullGolOpacity(): boolean {
    return game !== null && game !== 'paused';
  }

  function selectGolOpacity(): number {
    if (shouldUseFullGolOpacity()) return 1;
    return selectScrollEasedValue(
      window.scrollY,
      document.documentElement.scrollHeight - window.innerHeight,
      cfg.gol.opacity,
      cfg.gol.scrollEndOpacity,
    );
  }

  function syncGolOpacity(): void {
    if (golCanvas) golCanvas.style.opacity = String(selectGolOpacity());
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
    syncGolOpacity();
    paintGol();
    golTimer = setInterval(animLife, 33);
  }

  function startGame(): void {
    if (!golDims.cols || !golDims.rows) return;
    const spawned = spawnSnakeAt(golDims.cols, golDims.rows);
    snake = spawned.snake;
    dir = spawned.dir;
    pendingDir = spawned.dir;
    score = 0;
    snakeInterval = cfg.snake.initialStepMs;
    snakeAcc = 0;
    best = loadBestScore();
    startCountdown();
  }

  function startCountdown(): void {
    game = 'countdown';
    snakeAcc = 0;
    startLoop();
    if (golCanvas) golCanvas.style.opacity = '1';
    breakStatus.notify();
    let i = 0;
    const run = () => {
      if (game !== 'countdown') return;
      if (i >= COUNTDOWN_STEPS.length) {
        beginPlay();
        return;
      }
      countdownLabel = COUNTDOWN_STEPS[i];
      gameStatus.notify();
      i++;
      countTimer = setTimeout(run, countdownLabel === GAME_COPY.countdown.go ? 480 : 640);
    };
    if (countTimer) clearTimeout(countTimer);
    run();
  }

  function beginPlay(): void {
    game = 'play';
    snakeAcc = 0;
    playAt = performance.now();
    countdownLabel = null;
    breakStatus.notify();
    gameStatus.notify();
  }

  function pauseGame(): void {
    if (game !== 'play' && game !== 'countdown') return;
    if (countTimer) clearTimeout(countTimer);
    game = 'paused';
    countdownLabel = null;
    syncGolOpacity();
    breakStatus.notify();
    gameStatus.notify();
  }

  function quitGame(): void {
    if (!game) return;
    game = null;
    snake = [];
    if (snakeTimer) clearTimeout(snakeTimer);
    if (countTimer) clearTimeout(countTimer);
    countdownLabel = null;
    syncGolOpacity();
    breakStatus.notify();
    gameStatus.notify();
    paintGol();
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
    breakStatus.notify();
    gameStatus.notify();
  }

  function stepSnakeOnce(): void {
    dir = pendingDir;
    const result = stepSnake(snake, dir, golDims.cols, golDims.rows, cellVisible);
    if (result.kind === 'died') {
      snakeDie();
      return;
    }
    snake = result.snake;
    if (result.kind === 'ate') {
      grid[result.ateIndex] = 0;
      prevGrid[result.ateIndex] = 0;
      score++;
      snakeInterval = nextSnakeInterval(cfg.snake, score);
      const head = snake[0];
      spawnBurst(burstState, (head.c + 0.5) * CELL, (head.r + 0.5) * CELL, {
        sparks: cfg.snake.pickupParticleCount,
        stars: Math.round(cfg.snake.pickupParticleCount * 0.25),
        speed: cfg.snake.pickupParticleSpeed,
        flash: false,
        shock: false,
        bloom: false,
      });
      paintGol();
      gameStatus.notify();
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
      if (game === 'dead') quitGame();
      else pauseGame();
      return;
    }
    if ((key === ' ' || key === 'enter') && game === 'dead') {
      e.preventDefault();
      startGame();
    }
  }

  function drawSnakeUnderlay(ctx: CanvasRenderingContext2D, now: number): void {
    if (game !== 'play' && game !== 'countdown') return;
    drawSnakeBody(ctx, snake, CELL, cfg.snake.cellGapPx);
    if (game === 'countdown') {
      cutSnakeArrow(ctx, snake[0], dir, CELL, countdownArrowAlpha(now));
    } else if (game === 'play') {
      const alpha = playArrowAlpha(now - playAt);
      if (alpha !== null) cutSnakeArrow(ctx, snake[0], dir, CELL, alpha);
    }
  }

  function currentBreakStatus(): BreakPillStatus {
    return {
      canShow: !game || game === 'paused',
      label: game === 'paused' ? GAME_COPY.resumePill : GAME_COPY.breakPill,
    };
  }

  function currentGameStatus(): GameStatus {
    return { phase: game, score, best: Math.max(best, score), newBest, countdownLabel };
  }

  function startOrResume(origin: { x: number; y: number }): void {
    if (game && game !== 'paused') return;
    if (game === 'paused') {
      if (snakeTimer) clearTimeout(snakeTimer);
      snakeTimer = setTimeout(startCountdown, 260);
      return;
    }
    spawnBurst(burstState, origin.x, origin.y);
    startLoop();
    if (snakeTimer) clearTimeout(snakeTimer);
    snakeTimer = setTimeout(startGame, 380);
  }

  function initInteractive(canvas: HTMLCanvasElement): void {
    burstCanvas = canvas;
    burstCtx = burstCanvas.getContext('2d');
    if (burstCtx) burstDims = sizeBurstCanvas(burstCanvas, burstCtx);

    window.addEventListener('keydown', gameKey);
    disposers.push(() => window.removeEventListener('keydown', gameKey));
  }

  function onResize(): void {
    if (golCanvas) {
      sizeGol();
      paintGol();
      syncGolOpacity();
    }
    if (burstCanvas && burstCtx) burstDims = sizeBurstCanvas(burstCanvas, burstCtx);
  }

  function loop(): void {
    const now = performance.now();
    const loopDelta = lastLoopAt ? Math.min(80, now - lastLoopAt) : 16;
    lastLoopAt = now;
    tickSnake(loopDelta);
    const stillAnimating =
      burstCtx !== null &&
      tickBurst(burstCtx, burstState, now, burstDims, game === 'play' || game === 'countdown', drawSnakeUnderlay);
    if (stillAnimating) {
      raf = requestAnimationFrame(loop);
      return;
    }
    raf = 0;
    lastLoopAt = 0;
  }

  function startLoop(): void {
    if (raf) return;
    raf = requestAnimationFrame(loop);
  }

  function mount(targets: { gol: HTMLCanvasElement; burst: HTMLCanvasElement }): void {
    initGol(targets.gol);
    initInteractive(targets.burst);
    window.addEventListener('resize', onResize);
    disposers.push(() => window.removeEventListener('resize', onResize));
    window.addEventListener('scroll', syncGolOpacity, { passive: true });
    disposers.push(() => window.removeEventListener('scroll', syncGolOpacity));
  }

  function destroy(): void {
    cancelAnimationFrame(raf);
    if (golTimer) clearInterval(golTimer);
    if (countTimer) clearTimeout(countTimer);
    if (snakeTimer) clearTimeout(snakeTimer);
    for (const dispose of disposers) dispose();
    disposers.length = 0;
  }

  return {
    mount,
    destroy,
    onBreakStatusChange: breakStatus.subscribe,
    onGameStatusChange: gameStatus.subscribe,
    startOrResume,
    restartGame: startGame,
    quitGame,
  };
}

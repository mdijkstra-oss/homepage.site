import type { ForegroundConfig } from './foreground/motion';
import type { GolConfig } from './gol/life';
import type { SnakeConfig } from './snake/snake';

export interface EngineConfig {
  foreground: ForegroundConfig;
  gol: GolConfig;
  snake: SnakeConfig;
}

export type EngineProps = {
  foreground?: Partial<ForegroundConfig>;
  gol?: Partial<GolConfig>;
  snake?: Partial<SnakeConfig>;
};

const DEFAULTS: EngineConfig = {
  foreground: {
    revealViewportRatio: 0.74,
    revealDurationMs: 700,
    revealRisePx: 34,
    revealDriftPx: 22,
    revealTiltDeg: 14,
    revealInitialScale: 0.94,
    revealBlurPx: 3,
    flyDurationMs: 1050,
  },
  gol: {
    opacity: 0.42,
    generationFadeMs: 560,
    generationWaitMs: 280,
  },
  snake: {
    initialStepMs: 150,
    minimumStepMs: 60,
    stepReductionPerPointMs: 3,
    cellGapPx: 4,
    pickupParticleCount: 40,
    pickupParticleSpeed: 0.7,
  },
};

function withDefaults<T extends object>(defaults: T, overrides: Partial<T> = {}): T {
  const result = { ...defaults };
  for (const key of Object.keys(overrides) as Array<keyof T>) {
    const v = overrides[key];
    if (typeof v === 'number' && !Number.isNaN(v)) result[key] = v as T[keyof T];
  }
  return result;
}

export function readConfig(props: EngineProps = {}): EngineConfig {
  return {
    foreground: withDefaults(DEFAULTS.foreground, props.foreground),
    gol: withDefaults(DEFAULTS.gol, props.gol),
    snake: withDefaults(DEFAULTS.snake, props.snake),
  };
}

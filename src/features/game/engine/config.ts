import type { GolConfig } from './gol/life';
import type { SnakeConfig } from './snake/snake';

export interface EngineConfig {
  gol: GolConfig;
  snake: SnakeConfig;
}

export type EngineProps = {
  gol?: Partial<GolConfig>;
  snake?: Partial<SnakeConfig>;
};

const DEFAULTS: EngineConfig = {
  gol: {
    opacity: 0.42,
    scrollEndOpacity: 0.52,
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
    gol: withDefaults(DEFAULTS.gol, props.gol),
    snake: withDefaults(DEFAULTS.snake, props.snake),
  };
}

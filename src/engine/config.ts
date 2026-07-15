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
    animStart: 0.74,
    animDur: 700,
    animRise: 34,
    animDrift: 22,
    animTilt: 14,
    animScale: 0.94,
    animBlur: 3,
    flyDur: 1050,
  },
  gol: {
    golOpacity: 0.42,
    golFade: 560,
    golWait: 280,
  },
  snake: {
    snakeBase: 150,
    snakeMin: 60,
    snakeRamp: 3,
    snakeGap: 4,
    eatParticles: 40,
    eatPower: 0.7,
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

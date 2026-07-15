import { describe, expect, it } from 'vitest';
import { readConfig } from './config';

describe('readConfig', () => {
  it('fills every field with defaults when given nothing', () => {
    const cfg = readConfig();
    expect(cfg.foreground.revealDurationMs).toBe(700);
    expect(cfg.gol.opacity).toBe(0.42);
    expect(cfg.gol.scrollEndOpacity).toBe(0.52);
    expect(cfg.snake.initialStepMs).toBe(150);
  });

  it('applies a partial override without touching sibling fields', () => {
    const cfg = readConfig({ gol: { opacity: 0.9 } });
    expect(cfg.gol.opacity).toBe(0.9);
    expect(cfg.gol.scrollEndOpacity).toBe(0.52);
    expect(cfg.gol.generationFadeMs).toBe(560);
  });

  it.each([
    { name: 'undefined override', value: undefined },
    { name: 'null override', value: null },
    { name: 'NaN override', value: NaN },
  ])('falls back to default for $name', ({ value }) => {
    const cfg = readConfig({ snake: { initialStepMs: value as unknown as number } });
    expect(cfg.snake.initialStepMs).toBe(150);
  });
});

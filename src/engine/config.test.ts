import { describe, expect, it } from 'vitest';
import { readConfig } from './config';

describe('readConfig', () => {
  it('fills every field with defaults when given nothing', () => {
    const cfg = readConfig();
    expect(cfg.foreground.animDur).toBe(700);
    expect(cfg.gol.golOpacity).toBe(0.42);
    expect(cfg.snake.snakeBase).toBe(150);
  });

  it('applies a partial override without touching sibling fields', () => {
    const cfg = readConfig({ gol: { golOpacity: 0.9 } });
    expect(cfg.gol.golOpacity).toBe(0.9);
    expect(cfg.gol.golFade).toBe(560);
  });

  it.each([undefined, null, NaN])('falls back to default for %s', (bad) => {
    const cfg = readConfig({ snake: { snakeBase: bad as unknown as number } });
    expect(cfg.snake.snakeBase).toBe(150);
  });
});

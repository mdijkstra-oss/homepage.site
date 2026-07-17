// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import type { GameStatus } from '../engine/types';
import Game from './Game';

const idleStatus: GameStatus = { phase: null, score: 0, best: 0, newBest: false, countdownLabel: null };
const golCanvasRef = createRef<HTMLCanvasElement>();
const burstCanvasRef = createRef<HTMLCanvasElement>();

describe('Game', () => {
  afterEach(cleanup);

  it.each([
    [
      'shows the game HUD during play',
      { ...idleStatus, phase: 'play', score: 3, best: 5 },
      'SCORE 3   ·   BEST 5   ·   esc to return to work',
    ],
    ['shows the countdown label', { ...idleStatus, phase: 'countdown', countdownLabel: 'GO' }, 'GO'],
  ] as const)('%s', (_name, status, expectedText) => {
    const { container } = render(
      <Game
        status={status}
        onRestart={() => {}}
        onQuit={() => {}}
        golCanvasRef={golCanvasRef}
        burstCanvasRef={burstCanvasRef}
      />,
    );
    expect(container.textContent).toContain(expectedText);
  });

  it('uses React click handlers for game-over actions', () => {
    let restartCount = 0;
    let quitCount = 0;
    function restart() {
      restartCount++;
    }
    function quit() {
      quitCount++;
    }
    render(
      <Game
        status={{ ...idleStatus, phase: 'dead', score: 7, best: 9, newBest: true }}
        onRestart={restart}
        onQuit={quit}
        golCanvasRef={golCanvasRef}
        burstCanvasRef={burstCanvasRef}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /play again/i }));
    fireEvent.click(screen.getByRole('button', { name: /return to work/i }));

    expect(restartCount).toBe(1);
    expect(quitCount).toBe(1);
    expect(screen.getByText('★ NEW BEST')).not.toBeNull();
  });
});

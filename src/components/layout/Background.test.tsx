// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import Background from './Background';
import type { GameStatus } from '../../types/engine';

const idleStatus: GameStatus = { phase: null, score: 0, best: 0, newBest: false, countdownLabel: null };

describe('Background', () => {
  afterEach(cleanup);

  it.each([
    ['shows the game HUD during play', { ...idleStatus, phase: 'play', score: 3, best: 5 }, 'SCORE 3   ·   BEST 5   ·   esc to return to work'],
    ['shows the countdown label', { ...idleStatus, phase: 'countdown', countdownLabel: 'GO' }, 'GO'],
  ] as const)('%s', (_name, gameStatus, expectedText) => {
    const { container } = render(<Background gameStatus={gameStatus} onRestartGame={() => {}} onQuitGame={() => {}} />);
    expect(container.textContent).toContain(expectedText);
  });

  it('uses React click handlers for game-over actions', () => {
    let restartCount = 0;
    let quitCount = 0;
    const onRestartGame = () => { restartCount++; };
    const onQuitGame = () => { quitCount++; };
    render(<Background gameStatus={{ ...idleStatus, phase: 'dead', score: 7, best: 9, newBest: true }} onRestartGame={onRestartGame} onQuitGame={onQuitGame} />);

    fireEvent.click(screen.getByRole('button', { name: /play again/i }));
    fireEvent.click(screen.getByRole('button', { name: /return to work/i }));

    expect(restartCount).toBe(1);
    expect(quitCount).toBe(1);
    expect(screen.getByText('★ NEW BEST')).not.toBeNull();
  });
});

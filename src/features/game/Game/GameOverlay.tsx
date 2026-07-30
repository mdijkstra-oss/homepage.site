import { GAME_COPY } from '../copy';
import type { GameStatus } from '../engine/types';
import styles from './Game.module.css';

interface GameOverlayProps {
  status: GameStatus;
  onRestart: () => void;
  onQuit: () => void;
}

export function GameOverlay({ status, onRestart, onQuit }: GameOverlayProps) {
  const isGameVisible = status.phase === 'countdown' || status.phase === 'play';
  const isGameOver = status.phase === 'dead';
  return (
    <>
      <div aria-hidden={!isGameVisible} className={`${styles.hud} ${isGameVisible ? '' : styles.hidden}`}>
        {GAME_COPY.hud.score} {status.score}
        {GAME_COPY.hud.separator}
        {GAME_COPY.hud.best} {status.best}
        {GAME_COPY.hud.separator}
        {GAME_COPY.hud.hint}
      </div>

      {status.countdownLabel && (
        <div className={styles.countdownOverlay}>
          <div
            key={status.countdownLabel}
            className={`${styles.countdownLabel} ${status.countdownLabel === GAME_COPY.countdown.go ? styles.go : ''}`}
          >
            {status.countdownLabel}
          </div>
        </div>
      )}

      {isGameOver && (
        <div className={styles.gameOverOverlay}>
          <div className={styles.gameOverCard}>
            <div className={styles.gameOverTitle}>{GAME_COPY.gameOver.title}</div>
            <div className={`${styles.newBest} ${status.newBest ? '' : styles.hidden}`}>
              {GAME_COPY.gameOver.newBest}
            </div>
            <div className={styles.scoreRow}>
              <div>
                <div className={styles.scoreValue}>{status.score}</div>
                <div className={styles.scoreLabel}>{GAME_COPY.gameOver.scoreLabel}</div>
              </div>
              <div>
                <div className={`${styles.scoreValue} ${styles.bestValue}`}>{status.best}</div>
                <div className={styles.scoreLabel}>{GAME_COPY.gameOver.bestLabel}</div>
              </div>
            </div>
            <div className={styles.buttons}>
              <button type="button" onClick={onRestart} className={`${styles.button} ${styles.restart}`}>
                {GAME_COPY.gameOver.restart}{' '}
                <span className={styles.shortcut}>{GAME_COPY.gameOver.restartShortcut}</span>
              </button>
              <button type="button" onClick={onQuit} className={`${styles.button} ${styles.quit}`}>
                {GAME_COPY.gameOver.quit} <span className={styles.shortcut}>{GAME_COPY.gameOver.quitShortcut}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

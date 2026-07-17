import type { GameStatus } from '../engine/types';
import styles from './Game.module.css';

interface GameOverlayProps {
  status: GameStatus;
  onRestart: () => void;
  onQuit: () => void;
}

const HUD_SEPARATOR = '   ·   ';

export function GameOverlay({ status, onRestart, onQuit }: GameOverlayProps) {
  const isGameVisible = status.phase === 'countdown' || status.phase === 'play';
  const isGameOver = status.phase === 'dead';
  return (
    <>
      <div aria-hidden={!isGameVisible} className={`${styles.hud} ${isGameVisible ? '' : styles.hidden}`}>
        SCORE {status.score}
        {HUD_SEPARATOR}BEST {status.best}
        {HUD_SEPARATOR}esc to return to work
      </div>

      {status.countdownLabel && (
        <div className={styles.countdownOverlay}>
          <div
            key={status.countdownLabel}
            className={`${styles.countdownLabel} ${status.countdownLabel === 'GO' ? styles.go : ''}`}
          >
            {status.countdownLabel}
          </div>
        </div>
      )}

      {isGameOver && (
        <div className={styles.gameOverOverlay}>
          <div className={styles.gameOverCard}>
            <div className={styles.gameOverTitle}>GAME OVER</div>
            <div className={`${styles.newBest} ${status.newBest ? '' : styles.hidden}`}>★ NEW BEST</div>
            <div className={styles.scoreRow}>
              <div>
                <div className={styles.scoreValue}>{status.score}</div>
                <div className={styles.scoreLabel}>SCORE</div>
              </div>
              <div>
                <div className={`${styles.scoreValue} ${styles.bestValue}`}>{status.best}</div>
                <div className={styles.scoreLabel}>BEST</div>
              </div>
            </div>
            <div className={styles.buttons}>
              <button type="button" onClick={onRestart} className={`${styles.button} ${styles.restart}`}>
                Play again <span className={styles.shortcut}>SPACE</span>
              </button>
              <button type="button" onClick={onQuit} className={`${styles.button} ${styles.quit}`}>
                Return to work <span className={styles.shortcut}>ESC</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

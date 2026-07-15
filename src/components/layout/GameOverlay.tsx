import type { GameStatus } from '../../engine/types';
import styles from './Background.module.css';

interface GameOverlayProps {
  gameStatus: GameStatus;
  onRestartGame: () => void;
  onQuitGame: () => void;
}

export function GameOverlay({ gameStatus, onRestartGame, onQuitGame }: GameOverlayProps) {
  const isGameVisible = gameStatus.phase === 'countdown' || gameStatus.phase === 'play';
  const isGameOver = gameStatus.phase === 'dead';
  return (
    <>
      <div aria-hidden={!isGameVisible} className={`${styles.hud} ${isGameVisible ? '' : styles.hidden}`}>
        SCORE {gameStatus.score}   ·   BEST {gameStatus.best}   ·   esc to return to work
      </div>

      {gameStatus.countdownLabel && (
        <div className={styles.countdownOverlay}>
          <div key={gameStatus.countdownLabel} className={`${styles.countdownLabel} ${gameStatus.countdownLabel === 'GO' ? styles.go : ''}`}>
            {gameStatus.countdownLabel}
          </div>
        </div>
      )}

      {isGameOver && (
        <div className={styles.gameOverOverlay}>
          <div className={styles.gameOverCard}>
            <div className={styles.gameOverTitle}>GAME OVER</div>
            <div className={`${styles.newBest} ${gameStatus.newBest ? '' : styles.hidden}`}>★ NEW BEST</div>
            <div className={styles.scoreRow}>
              <div>
                <div className={styles.scoreValue}>{gameStatus.score}</div>
                <div className={styles.scoreLabel}>SCORE</div>
              </div>
              <div>
                <div className={`${styles.scoreValue} ${styles.bestValue}`}>{gameStatus.best}</div>
                <div className={styles.scoreLabel}>BEST</div>
              </div>
            </div>
            <div className={styles.buttons}>
              <button onClick={onRestartGame} className={`${styles.button} ${styles.restart}`}>
                Play again <span className={styles.shortcut}>SPACE</span>
              </button>
              <button onClick={onQuitGame} className={`${styles.button} ${styles.quit}`}>
                Return to work <span className={styles.shortcut}>ESC</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

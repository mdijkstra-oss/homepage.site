import type { RefObject } from 'react';
import type { GameStatus } from '../engine/types';
import styles from './Game.module.css';
import { GameOverlay } from './GameOverlay';

interface GameProps {
  status: GameStatus;
  golCanvasRef: RefObject<HTMLCanvasElement>;
  burstCanvasRef: RefObject<HTMLCanvasElement>;
  onRestart: () => void;
  onQuit: () => void;
}

export default function Game({ status, golCanvasRef, burstCanvasRef, onRestart, onQuit }: GameProps) {
  return (
    <>
      <canvas ref={golCanvasRef} className={styles.golCanvas} />
      <canvas ref={burstCanvasRef} className={styles.burstCanvas} />
      <GameOverlay status={status} onRestart={onRestart} onQuit={onQuit} />
    </>
  );
}

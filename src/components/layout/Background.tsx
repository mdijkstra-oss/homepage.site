import { Aurora, GameCanvases, Grid, Vignette } from './BackgroundLayers';
import { GameOverlay } from './GameOverlay';
import type { GameStatus } from '../../engine/types';

interface BackgroundProps {
  gameStatus: GameStatus;
  onRestartGame: () => void;
  onQuitGame: () => void;
}

export default function Background({ gameStatus, onRestartGame, onQuitGame }: BackgroundProps) {
  return (
    <>
      <GameCanvases />
      <GameOverlay gameStatus={gameStatus} onRestartGame={onRestartGame} onQuitGame={onQuitGame} />
      <Aurora />
      <Grid />
      <Vignette />
    </>
  );
}

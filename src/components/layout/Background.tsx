import type { GameStatus } from '../../engine/types';
import { DecorativeBackdrop, GameCanvases, Grid, Vignette } from './BackgroundLayers';
import { GameOverlay } from './GameOverlay';

interface BackgroundProps {
  gameStatus: GameStatus;
  onRestartGame: () => void;
  onQuitGame: () => void;
}

export default function Background({ gameStatus, onRestartGame, onQuitGame }: BackgroundProps) {
  return (
    <>
      <DecorativeBackdrop />
      <GameCanvases />
      <GameOverlay gameStatus={gameStatus} onRestartGame={onRestartGame} onQuitGame={onQuitGame} />
      <Grid />
      <Vignette />
    </>
  );
}

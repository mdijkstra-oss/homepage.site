import { useCallback, useEffect, useRef, useState } from 'react';
import type { EngineProps } from '../engine/config';
import { createGameEngine } from '../engine/createGameEngine';
import type { BreakPillStatus, GameEngineHandle, GameStatus } from '../engine/types';

const DEFAULT_BREAK_STATUS: BreakPillStatus = { canShow: true, label: 'Take a break' };
const DEFAULT_GAME_STATUS: GameStatus = { phase: null, score: 0, best: 0, newBest: false, countdownLabel: null };

export function useGameEngine(config: EngineProps) {
  const golCanvasRef = useRef<HTMLCanvasElement>(null);
  const burstCanvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngineHandle | null>(null);
  const [breakStatus, setBreakStatus] = useState(DEFAULT_BREAK_STATUS);
  const [gameStatus, setGameStatus] = useState(DEFAULT_GAME_STATUS);

  useEffect(
    function mountGameEngine() {
      const gol = golCanvasRef.current;
      const burst = burstCanvasRef.current;
      if (!gol || !burst) return;
      const engine = createGameEngine(config);
      engineRef.current = engine;
      const unsubscribeBreakStatus = engine.onBreakStatusChange(setBreakStatus);
      const unsubscribeGameStatus = engine.onGameStatusChange(setGameStatus);
      engine.mount({ gol, burst });
      return function destroyGameEngine() {
        unsubscribeBreakStatus();
        unsubscribeGameStatus();
        engine.destroy();
        engineRef.current = null;
      };
    },
    [config],
  );

  const startOrResume = useCallback(function startOrResume(origin: { x: number; y: number }) {
    engineRef.current?.startOrResume(origin);
  }, []);
  const restartGame = useCallback(function restartGame() {
    engineRef.current?.restartGame();
  }, []);
  const quitGame = useCallback(function quitGame() {
    engineRef.current?.quitGame();
  }, []);

  return { golCanvasRef, burstCanvasRef, breakStatus, gameStatus, startOrResume, restartGame, quitGame };
}

export interface ForegroundConfig {
  revealViewportRatio: number;
  revealDurationMs: number;
  revealRisePx: number;
  revealDriftPx: number;
  revealTiltDeg: number;
  revealInitialScale: number;
  revealBlurPx: number;
  flyDurationMs: number;
}

export const FOREGROUND_CONFIG: ForegroundConfig = {
  revealViewportRatio: 0.74,
  revealDurationMs: 550,
  revealRisePx: 0,
  revealDriftPx: 0,
  revealTiltDeg: 0,
  revealInitialScale: 0.94,
  revealBlurPx: 3,
  flyDurationMs: 1050,
};

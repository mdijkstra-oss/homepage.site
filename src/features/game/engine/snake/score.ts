const BEST_SCORE_KEY = 'sl_snake_best';

export function parseBestScore(value: string | null): number {
  const score = Number(value);
  return Number.isFinite(score) && score >= 0 ? score : 0;
}

export function loadBestScore(): number {
  try {
    return parseBestScore(localStorage.getItem(BEST_SCORE_KEY));
  } catch {
    return 0;
  }
}

export function saveBestScore(score: number): void {
  try {
    localStorage.setItem(BEST_SCORE_KEY, String(score));
  } catch {
    return;
  }
}

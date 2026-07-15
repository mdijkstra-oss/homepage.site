import { clamp } from './clamp';
import { smootherstep } from './easing';

export function selectScrollFadeOpacity(scrollTop: number, scrollableDistance: number, minimumOpacity: number): number {
  return selectScrollEasedValue(scrollTop, scrollableDistance, 1, clamp(minimumOpacity, 0, 1));
}

export function selectScrollEasedValue(
  scrollTop: number,
  scrollableDistance: number,
  startValue: number,
  endValue: number,
): number {
  if (scrollableDistance <= 0) return startValue;

  const progress = clamp(scrollTop / scrollableDistance, 0, 1);
  return startValue + (endValue - startValue) * smootherstep(progress);
}

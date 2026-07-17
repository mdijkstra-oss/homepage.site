import { describe, expect, it } from 'vitest';
import { selectScrollEasedValue, selectScrollFadeOpacity } from './scrollOpacity';

describe('selectScrollFadeOpacity', () => {
  it.each([
    ['keeps full opacity when the page does not scroll', 0, 0, 0.18, 1],
    ['keeps full opacity at the top', 0, 1000, 0.18, 1],
    ['eases opacity at half the scroll distance', 500, 1000, 0.18, 0.59],
    ['reaches minimum opacity at the bottom', 1000, 1000, 0.18, 0.18],
    ['clamps scroll above the bottom', 1500, 1000, 0.18, 0.18],
    ['clamps scroll below the top', -100, 1000, 0.18, 1],
  ] as const)('%s', (_name, scrollTop, scrollableDistance, minimumOpacity, expected) => {
    expect(selectScrollFadeOpacity(scrollTop, scrollableDistance, minimumOpacity)).toBeCloseTo(expected);
  });
});

describe('selectScrollEasedValue', () => {
  it.each([
    ['returns the start value when the page does not scroll', 0, 0, 0.44],
    ['returns the start value at the top', 0, 1000, 0.44],
    ['eases halfway between both values', 500, 1000, 0.49],
    ['returns the end value at the bottom', 1000, 1000, 0.54],
    ['clamps above the bottom', 1500, 1000, 0.54],
    ['clamps below the top', -100, 1000, 0.44],
  ] as const)('%s', (_name, scrollTop, scrollableDistance, expected) => {
    expect(selectScrollEasedValue(scrollTop, scrollableDistance, 0.44, 0.54)).toBeCloseTo(expected);
  });
});

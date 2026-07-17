import { type RefObject, useCallback, useEffect, useRef } from 'react';
import type { ForegroundConfig } from '../config';
import { computeFlyFrame, computeFlyVector } from './flyAwayMotion';

interface FlyAwayHandle {
  flyIn: () => void;
  flyOut: (preDelay?: number) => void;
}

function selectSeed(element: HTMLElement, seeds: WeakMap<HTMLElement, { x: number; r: number }>) {
  const stored = seeds.get(element);
  if (stored) return stored;
  const seed = { x: Math.random() * 2 - 1, r: Math.random() * 2 - 1 };
  seeds.set(element, seed);
  return seed;
}

export function useFlyAway(rootRef: RefObject<HTMLElement | null>, config: ForegroundConfig): FlyAwayHandle {
  const animationsRef = useRef<Animation[]>([]);
  const seedsRef = useRef(new WeakMap<HTMLElement, { x: number; r: number }>());

  const flyIn = useCallback(function flyIn() {
    for (const animation of animationsRef.current) animation.reverse();
  }, []);

  const flyOut = useCallback(
    function flyOut(preDelay = 0) {
      for (const animation of animationsRef.current) animation.cancel();
      const root = rootRef.current;
      if (!root) return;
      const viewport = { w: window.innerWidth || 1200, h: window.innerHeight || 800 };
      const origin = { x: viewport.w / 2, y: viewport.h / 2 };
      const elements = [...root.querySelectorAll<HTMLElement>('[data-fly-away]')];
      animationsRef.current = elements.map(function animateElement(element) {
        const rect = element.getBoundingClientRect();
        const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        const vector = computeFlyVector(center, origin, selectSeed(element, seedsRef.current), viewport);
        const frame = computeFlyFrame(1, vector);
        return element.animate(
          [
            { transform: 'translate(0, 0) rotate(0) scale(1)', opacity: 1, filter: 'none' },
            {
              transform: `translate(${frame.x}px, ${frame.y}px) rotate(${frame.rot}deg) scale(${frame.scale})`,
              opacity: frame.opacity,
              filter: `blur(${frame.blur}px)`,
            },
          ],
          { duration: config.flyDurationMs, delay: preDelay, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' },
        );
      });
    },
    [config.flyDurationMs, rootRef],
  );

  useEffect(function cancelAnimationsOnUnmount() {
    return function cancelAnimations() {
      for (const animation of animationsRef.current) animation.cancel();
    };
  }, []);

  return { flyIn, flyOut };
}

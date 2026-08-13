import { type CSSProperties, type ReactNode, useEffect, useRef } from 'react';
import type { ForegroundConfig } from '../config';
import styles from './PageTransitionItem.module.css';

interface PageTransitionItemProps {
  children: ReactNode;
  config: ForegroundConfig;
  /**
   * A live chat turn has already arrived, so it fades in where it lands. Waiting to be
   * scrolled to would hide it: the feed's bottom padding drops a new turn below the
   * reveal line, and an empty thinking bubble is too short to ever reach it.
   */
  revealOnMount?: boolean;
}

export default function PageTransitionItem({ children, config, revealOnMount = false }: PageTransitionItemProps) {
  const scrollRevealRef = useRef<HTMLDivElement>(null);

  useEffect(
    function observeReveal() {
      const revealElement = scrollRevealRef.current;
      if (!revealElement) return;
      const element: HTMLDivElement = revealElement;
      const rect = element.getBoundingClientRect();
      const direction = rect.left + rect.width / 2 >= window.innerWidth / 2 ? 1 : -1;
      element.style.setProperty('--reveal-x', `${config.revealDriftPx * direction}px`);

      if (revealOnMount || !('IntersectionObserver' in window)) {
        element.dataset.visible = '';
        return;
      }

      function reveal(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        element.dataset.visible = '';
        observer.disconnect();
      }

      const observer = new IntersectionObserver(reveal, {
        rootMargin: `0px 0px -${Math.round((1 - config.revealViewportRatio) * 100)}% 0px`,
      });
      observer.observe(element);
      return () => observer.disconnect();
    },
    [config, revealOnMount],
  );

  const revealStyle = {
    '--reveal-duration': `${config.revealDurationMs}ms`,
    '--reveal-y': `${config.revealRisePx}px`,
    '--reveal-scale': config.revealInitialScale,
    '--reveal-blur': `${config.revealBlurPx}px`,
    '--reveal-tilt': `${config.revealTiltDeg}deg`,
  } as CSSProperties;

  return (
    <div data-fly-away="" className={styles.flyAwayTarget}>
      <div ref={scrollRevealRef} className={styles.scrollReveal} style={revealStyle}>
        {children}
      </div>
    </div>
  );
}

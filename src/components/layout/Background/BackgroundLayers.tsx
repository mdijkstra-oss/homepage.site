import { useEffect, useRef } from 'react';
import { selectScrollFadeOpacity } from '../../../lib/animation/scrollOpacity';
import styles from './Background.module.css';

export function DecorativeBackdrop() {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(function bindBackdropFade() {
    function updateBackdropOpacity() {
      const opacity = selectScrollFadeOpacity(
        window.scrollY,
        document.documentElement.scrollHeight - window.innerHeight,
        DECORATIVE_MINIMUM_OPACITY,
      );
      if (backdropRef.current) backdropRef.current.style.opacity = String(opacity);
    }

    updateBackdropOpacity();
    window.addEventListener('scroll', updateBackdropOpacity, { passive: true });
    window.addEventListener('resize', updateBackdropOpacity);

    return function unbindBackdropFade() {
      window.removeEventListener('scroll', updateBackdropOpacity);
      window.removeEventListener('resize', updateBackdropOpacity);
    };
  }, []);

  return (
    <div ref={backdropRef} className={styles.decorativeBackdrop}>
      <div className={styles.lightBackground} />
      <div className={styles.aurora} />
    </div>
  );
}

export function Grid() {
  return <div className={styles.grid} />;
}

export function Vignette() {
  return <div className={styles.vignette} />;
}

const DECORATIVE_MINIMUM_OPACITY = 0.18;

import { type ReactNode, type RefObject, useEffect, useRef, useState } from 'react';
import { smoothstep } from '../../../lib/animation/easing';
import { clamp } from '../../../lib/clamp';
import styles from './ProximityReveal.module.css';

interface ProximityRevealProps {
  target: RefObject<HTMLElement | null>;
  near?: number;
  far?: number;
  disabled?: boolean;
  children: (interaction: { disabled: boolean; tabIndex: number | undefined }) => ReactNode;
}

export default function ProximityReveal({ target, near = 40, far = 150, disabled, children }: ProximityRevealProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const smoothedRef = useRef(0);
  const [canInteract, setCanInteract] = useState(false);

  useEffect(() => {
    if (!disabled) return;
    smoothedRef.current = 0;
    setCanInteract(false);
    const wrap = wrapRef.current;
    if (!wrap) return;
    wrap.style.transform = 'translateY(150%)';
    wrap.style.pointerEvents = 'none';
  }, [disabled]);

  useEffect(() => {
    function onMove(e: PointerEvent) {
      const wrap = wrapRef.current,
        targetEl = target.current;
      if (!wrap) return;
      let raw = 0;
      if (!disabled && targetEl) {
        const r = targetEl.getBoundingClientRect();
        const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
        raw = clamp(1 - (d - near) / (far - near), 0, 1);
      }
      const next = smoothedRef.current + (raw - smoothedRef.current) * 0.22;
      smoothedRef.current = next;
      const eased = smoothstep(next);
      const nextCanInteract = !disabled && eased > 0.6;
      wrap.style.transform = `translateY(${((1 - eased) * 150).toFixed(1)}%)`;
      wrap.style.pointerEvents = nextCanInteract ? 'auto' : 'none';
      setCanInteract((current) => (current === nextCanInteract ? current : nextCanInteract));
    }
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [target, near, far, disabled]);

  return (
    <div ref={wrapRef} className={styles.wrapper}>
      {children({ disabled: !canInteract, tabIndex: canInteract ? undefined : -1 })}
    </div>
  );
}

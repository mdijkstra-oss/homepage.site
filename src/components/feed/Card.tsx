import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import { shineOnLeave, shineOnMove } from '../effects/shine';

export const cardBase: CSSProperties = {
  position: 'relative',
  opacity: 0,
  maxWidth: 640,
  width: '100%',
  background: 'linear-gradient(140deg, rgba(255,255,255,0.14), rgba(255,255,255,0.035)), linear-gradient(rgba(12,14,19,0.5), rgba(12,14,19,0.5))',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: 22,
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 18px 50px rgba(0,0,0,0.45)',
  padding: 26,
};

interface CardProps {
  shine?: boolean;
  radius?: number;
  style?: CSSProperties;
  children: ReactNode;
}

export function Card({ shine, radius = 22, style, children }: CardProps) {
  const fillRef = useRef<HTMLDivElement>(null);
  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (fillRef.current) shineOnMove(fillRef.current, e);
  };
  const handlePointerLeave = () => {
    if (fillRef.current) shineOnLeave(fillRef.current);
  };
  return (
    <div data-bubble="" style={{ ...cardBase, borderRadius: radius, ...style }} onPointerMove={shine ? handlePointerMove : undefined} onPointerLeave={shine ? handlePointerLeave : undefined}>
      {shine && <div ref={fillRef} style={{ position: 'absolute', inset: 0, borderRadius: radius, pointerEvents: 'none', backgroundImage: 'none' }} />}
      {children}
    </div>
  );
}

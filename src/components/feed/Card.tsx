import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import { clearPointerSpotlight, paintPointerSpotlight } from '../effects/pointerSpotlight';

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
  radius?: number;
  style?: CSSProperties;
  children: ReactNode;
}

export function Card({ radius = 22, style, children }: CardProps) {
  return <CardFrame radius={radius} style={style}>{children}</CardFrame>;
}

export function InteractiveCard({ radius = 22, style, children }: CardProps) {
  const fillRef = useRef<HTMLDivElement>(null);
  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (fillRef.current) paintPointerSpotlight(fillRef.current, e);
  };
  const handlePointerLeave = () => {
    if (fillRef.current) clearPointerSpotlight(fillRef.current);
  };
  return (
    <CardFrame radius={radius} style={style} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
      <div ref={fillRef} style={{ position: 'absolute', inset: 0, borderRadius: radius, pointerEvents: 'none', backgroundImage: 'none' }} />
      {children}
    </CardFrame>
  );
}

function CardFrame({ radius, style, children, onPointerMove, onPointerLeave }: CardProps & { onPointerMove?: (event: PointerEvent<HTMLDivElement>) => void; onPointerLeave?: () => void }) {
  return <div data-bubble="" style={{ ...cardBase, borderRadius: radius, ...style }} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>{children}</div>;
}

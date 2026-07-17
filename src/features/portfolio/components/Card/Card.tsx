import { type CSSProperties, type PointerEvent, type ReactNode, useRef } from 'react';
import spotlightStyles from '../../../../components/effects/PointerSpotlight/PointerSpotlight.module.css';
import {
  clearPointerSpotlight,
  paintPointerSpotlight,
} from '../../../../components/effects/PointerSpotlight/pointerSpotlight';
import styles from './Card.module.css';

interface CardProps {
  radius?: number;
  style?: CSSProperties;
  children: ReactNode;
  className?: string;
}

export function Card({ radius = 22, style, children, className }: CardProps) {
  return (
    <CardFrame radius={radius} style={style} className={className}>
      {children}
    </CardFrame>
  );
}

export function InteractiveCard({ radius = 22, style, children, className }: CardProps) {
  const fillRef = useRef<HTMLDivElement>(null);
  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (fillRef.current) paintPointerSpotlight(fillRef.current, e);
  };
  const handlePointerLeave = () => {
    if (fillRef.current) clearPointerSpotlight(fillRef.current);
  };
  return (
    <CardFrame
      radius={radius}
      style={style}
      className={className}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div ref={fillRef} className={spotlightStyles.spotlight} />
      {children}
    </CardFrame>
  );
}

function CardFrame({
  radius = 22,
  style,
  children,
  className,
  onPointerMove,
  onPointerLeave,
}: CardProps & { onPointerMove?: (event: PointerEvent<HTMLDivElement>) => void; onPointerLeave?: () => void }) {
  const runtimeStyle = { '--card-radius': `${radius}px`, ...style } as CSSProperties;
  return (
    <div
      className={`${styles.card} ${className ?? ''}`}
      style={runtimeStyle}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </div>
  );
}

import type { ReactNode } from 'react';
import {
  clearPointerSpotlight,
  paintPointerSpotlight,
} from '../../../../../components/effects/PointerSpotlight/pointerSpotlight';
import styles from './SpotlightRow.module.css';

interface SpotlightRowProps {
  className?: string;
  children: ReactNode;
}

export function SpotlightRow({ className, children }: SpotlightRowProps) {
  return (
    <div
      onPointerMove={(event) => paintPointerSpotlight(event.currentTarget, event)}
      onPointerLeave={(event) => clearPointerSpotlight(event.currentTarget)}
      className={`${styles.row} ${className ?? ''}`}
    >
      {children}
    </div>
  );
}

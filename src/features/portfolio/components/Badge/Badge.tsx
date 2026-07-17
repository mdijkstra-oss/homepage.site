import type { ReactNode } from 'react';
import { BADGE_PALETTES, type BadgeKind } from '../../model/palette';
import styles from './Badge.module.css';

export function Badge({ kind, children }: { kind: BadgeKind; children: ReactNode }) {
  const palette = BADGE_PALETTES[kind];
  return (
    <div className={`${styles.badge} ${styles[kind]}`}>
      {palette.icon} {children}
    </div>
  );
}

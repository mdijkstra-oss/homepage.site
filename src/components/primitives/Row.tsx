import type { ReactNode } from 'react';
import styles from './Row.module.css';

interface RowProps {
  alignment?: 'start' | 'end';
  children: ReactNode;
}

export function Row({ alignment = 'start', children }: RowProps) {
  return <div className={alignment === 'start' ? styles.start : styles.end}>{children}</div>;
}

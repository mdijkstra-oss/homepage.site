import type { CSSProperties } from 'react';
import styles from './WipeButton.module.css';
import wipeStyles from '../primitives/Wipe.module.css';

interface WipeButtonProps {
  href: string;
  label: string;
  target?: string;
  rel?: string;
  background?: string;
  color?: string;
  fillBg?: string;
  fillColor?: string;
}

export function WipeButton({ href, label, target, rel, background = '#fff', color = '#0a0c14', fillBg = '#567cff', fillColor = '#fff' }: WipeButtonProps) {
  const runtimeColors = {
    '--wipe-background': background,
    '--wipe-color': color,
    '--wipe-fill-background': fillBg,
    '--wipe-fill-color': fillColor,
  } as CSSProperties;
  return (
    <a href={href} target={target} rel={rel} className={`${wipeStyles.wipe} ${styles.button}`} style={runtimeColors}>
      <span className={styles.label}>{label}</span>
      <span className={`${wipeStyles.fill} ${styles.fill}`}>{label}</span>
    </a>
  );
}

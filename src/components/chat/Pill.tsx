import type { CSSProperties, MouseEvent } from 'react';
import wipeStyles from '../primitives/Wipe.module.css';
import styles from './Pill.module.css';

export interface PillProps {
  icon: string;
  label: string;
  iconColor?: string;
  hoverBg: string;
  hoverColor: string;
  hoverBorder: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  tabIndex?: number;
}

export default function Pill({ icon, label, iconColor, hoverBg, hoverColor, hoverBorder, onClick, disabled, tabIndex }: PillProps) {
  const runtimeColors = {
    '--pill-icon-color': iconColor,
    '--pill-hover-background': hoverBg,
    '--pill-hover-color': hoverColor,
    '--pill-hover-border': hoverBorder,
  } as CSSProperties;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      tabIndex={tabIndex}
      className={`${styles.pill} ${wipeStyles.wipe}`}
      style={runtimeColors}
    >
      <span className={styles.icon}>{icon}</span>{label}
      <span className={`${wipeStyles.fill} ${styles.fill}`}>
        <span className={styles.icon}>{icon}</span>{label}
      </span>
    </button>
  );
}

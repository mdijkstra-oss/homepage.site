import type { CSSProperties, MouseEvent } from 'react';
import wipeStyles from '../Wipe.module.css';
import styles from './Pill.module.css';

interface PillBaseProps {
  icon: string;
  label: string;
  iconColor?: string;
  hoverBg: string;
  hoverColor: string;
  tabIndex?: number;
}

type PillButtonProps = PillBaseProps & {
  href?: never;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
};

type PillLinkProps = PillBaseProps & {
  href: string;
  onClick?: never;
  disabled?: never;
};

export type PillProps = PillButtonProps | PillLinkProps;

function PillContents({ icon, label }: Pick<PillBaseProps, 'icon' | 'label'>) {
  return (
    <>
      <span className={styles.icon}>{icon}</span>
      {label}
      <span aria-hidden="true" className={`${wipeStyles.fill} ${styles.fill}`}>
        <span className={styles.icon}>{icon}</span>
        {label}
      </span>
    </>
  );
}

export default function Pill(props: PillProps) {
  const { icon, label, iconColor, hoverBg, hoverColor, tabIndex } = props;
  const runtimeColors = {
    '--pill-icon-color': iconColor,
    '--pill-hover-background': hoverBg,
    '--pill-hover-color': hoverColor,
  } as CSSProperties;
  const className = `${styles.pill} ${wipeStyles.wipe}`;
  if (props.href) {
    return (
      <a href={props.href} aria-label={label} tabIndex={tabIndex} className={className} style={runtimeColors}>
        <PillContents icon={icon} label={label} />
      </a>
    );
  }
  return (
    <button
      type="button"
      aria-label={label}
      onClick={props.onClick}
      disabled={props.disabled}
      tabIndex={tabIndex}
      className={className}
      style={runtimeColors}
    >
      <PillContents icon={icon} label={label} />
    </button>
  );
}

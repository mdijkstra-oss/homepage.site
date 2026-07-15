import type { CSSProperties, MouseEvent } from 'react';
import { FG } from '../primitives/theme';

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
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      tabIndex={tabIndex}
      className="pill wipe-btn"
      style={{
        '--pill-hover-border': hoverBorder,
        flex: '0 0 auto', whiteSpace: 'nowrap', cursor: 'pointer', position: 'relative', overflow: 'hidden',
        display: 'inline-flex', alignItems: 'center', gap: 7, padding: '7px 14px', borderRadius: 999,
        background: 'linear-gradient(180deg, rgba(40,46,60,0.92), rgba(24,29,39,0.92))', border: '1px solid rgba(255,255,255,0.16)',
        color: '#d6def0', fontFamily: FG, fontWeight: 600, fontSize: 12.5,
      } as CSSProperties}
    >
      <span style={{ opacity: .9, fontSize: 11.5, color: iconColor }}>{icon}</span>{label}
      <span className="wipe-fill" style={{ gap: 7, background: hoverBg, color: hoverColor, fontFamily: FG, fontWeight: 600, fontSize: 12.5 }}>
        <span style={{ opacity: .9, fontSize: 11.5 }}>{icon}</span>{label}
      </span>
    </button>
  );
}

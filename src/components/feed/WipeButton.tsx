import { FG } from '../primitives/theme';

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
  return (
    <a href={href} target={target} rel={rel} className="wipe-btn" style={{ position: 'relative', overflow: 'hidden', display: 'inline-block', background, color, border: 'none', borderRadius: 12, padding: '10px 18px', fontFamily: FG, fontWeight: 700, fontSize: 13.5, cursor: 'pointer', textDecoration: 'none' }}>
      <span style={{ display: 'block', whiteSpace: 'nowrap' }}>{label}</span>
      <span className="wipe-fill" style={{ background: fillBg, color: fillColor, whiteSpace: 'nowrap', fontFamily: FG, fontWeight: 700, fontSize: 13.5 }}>{label}</span>
    </a>
  );
}

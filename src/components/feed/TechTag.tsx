import type { ReactNode } from 'react';
import { MONO } from '../primitives/theme';

export function TechTag({ children }: { children: ReactNode }) {
  return <span style={{ display: 'inline-flex', padding: '5px 11px', borderRadius: 8, background: 'rgba(140,170,255,0.1)', border: '1px solid rgba(140,170,255,0.25)', color: '#bccaea', fontFamily: MONO, fontSize: 11, letterSpacing: '.02em' }}>{children}</span>;
}

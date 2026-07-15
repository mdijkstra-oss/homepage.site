import type { CSSProperties, ReactNode } from 'react';
import { MONO } from '../primitives/theme';

export interface BadgePalette {
  bg: string;
  border: string;
  color: string;
  icon: string;
}

const badgeBase: CSSProperties = {
  position: 'absolute',
  top: -12,
  right: 20,
  fontFamily: MONO,
  fontSize: 10.5,
  letterSpacing: '.14em',
  padding: '5px 13px',
  borderRadius: 999,
  whiteSpace: 'nowrap',
  boxShadow: '0 6px 18px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.15)',
};

const BADGES: Record<string, BadgePalette> = {
  profile: { bg: 'linear-gradient(180deg, rgba(30,74,54,0.95), rgba(19,52,38,0.92))', border: 'rgba(120,255,180,0.55)', color: '#c4f7da', icon: '●' },
  role: { bg: 'linear-gradient(180deg, rgba(64,40,110,0.95), rgba(44,28,78,0.92))', border: 'rgba(190,150,255,0.55)', color: '#e2d4ff', icon: '✚' },
  noteBlue: { bg: 'linear-gradient(180deg, rgba(34,52,104,0.95), rgba(22,34,70,0.92))', border: 'rgba(140,170,255,0.55)', color: '#d7e2ff', icon: '◆' },
  experience: { bg: 'linear-gradient(180deg, rgba(34,52,104,0.95), rgba(22,34,70,0.92))', border: 'rgba(140,170,255,0.55)', color: '#d7e2ff', icon: '◆' },
  also: { bg: 'linear-gradient(180deg, rgba(40,48,62,0.96), rgba(26,32,42,0.92))', border: 'rgba(180,200,230,0.4)', color: '#dce6f4', icon: '✦' },
  education: { bg: 'linear-gradient(180deg, rgba(20,72,80,0.95), rgba(14,50,56,0.92))', border: 'rgba(110,220,235,0.5)', color: '#c2eef5', icon: '⌂' },
  reviews: { bg: 'linear-gradient(180deg, rgba(10,66,124,0.96), rgba(8,46,90,0.92))', border: 'rgba(120,180,255,0.55)', color: '#cfe3ff', icon: '★' },
  approach: { bg: 'linear-gradient(180deg, rgba(96,32,72,0.95), rgba(66,22,50,0.92))', border: 'rgba(255,140,200,0.5)', color: '#ffd2e8', icon: '✦' },
};

export function Badge({ kind, children }: { kind: string; children: ReactNode }) {
  const badge = BADGES[kind];
  return <div style={{ ...badgeBase, background: badge.bg, border: `1px solid ${badge.border}`, color: badge.color }}>{badge.icon} {children}</div>;
}

import React from 'react';

export const FG = "'Space Grotesk', sans-serif";
export const MONO = "'Space Mono', monospace";

// glass "special card" base (profile / role / note / reviews / …)
export const cardBase = {
  position: 'relative',
  opacity: 0, // engine drives the scroll-lift reveal
  maxWidth: 640,
  width: '100%',
  background:
    'linear-gradient(140deg, rgba(255,255,255,0.14), rgba(255,255,255,0.035)), linear-gradient(rgba(12,14,19,0.5), rgba(12,14,19,0.5))',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: 22,
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 18px 50px rgba(0,0,0,0.45)',
  padding: 26,
};

const badgeBase = {
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

// per-card badge palettes
export const BADGES = {
  profile:    { bg: 'linear-gradient(180deg, rgba(30,74,54,0.95), rgba(19,52,38,0.92))',   border: 'rgba(120,255,180,0.55)', color: '#c4f7da', icon: '●' },
  role:       { bg: 'linear-gradient(180deg, rgba(64,40,110,0.95), rgba(44,28,78,0.92))',   border: 'rgba(190,150,255,0.55)', color: '#e2d4ff', icon: '✚' },
  noteBlue:   { bg: 'linear-gradient(180deg, rgba(34,52,104,0.95), rgba(22,34,70,0.92))',   border: 'rgba(140,170,255,0.55)', color: '#d7e2ff', icon: '◆' },
  experience: { bg: 'linear-gradient(180deg, rgba(34,52,104,0.95), rgba(22,34,70,0.92))',   border: 'rgba(140,170,255,0.55)', color: '#d7e2ff', icon: '◆' },
  also:       { bg: 'linear-gradient(180deg, rgba(40,48,62,0.96), rgba(26,32,42,0.92))',    border: 'rgba(180,200,230,0.4)',  color: '#dce6f4', icon: '✦' },
  education:  { bg: 'linear-gradient(180deg, rgba(20,72,80,0.95), rgba(14,50,56,0.92))',     border: 'rgba(110,220,235,0.5)',  color: '#c2eef5', icon: '⌂' },
  reviews:    { bg: 'linear-gradient(180deg, rgba(10,66,124,0.96), rgba(8,46,90,0.92))',     border: 'rgba(120,180,255,0.55)', color: '#cfe3ff', icon: '★' },
  approach:   { bg: 'linear-gradient(180deg, rgba(96,32,72,0.95), rgba(66,22,50,0.92))',     border: 'rgba(255,140,200,0.5)',  color: '#ffd2e8', icon: '✦' },
};

export function Badge({ kind, children }) {
  const b = BADGES[kind];
  return (
    <div style={{ ...badgeBase, background: b.bg, border: `1px solid ${b.border}`, color: b.color }}>
      {b.icon} {children}
    </div>
  );
}

// justify-start row wrapper (cards) / justify-end (user bubble)
export function Row({ end, children }) {
  return <div style={{ display: 'flex', justifyContent: end ? 'flex-end' : 'flex-start' }}>{children}</div>;
}

// The glass card. `shine` adds the mouse-follow highlight layer the engine paints.
export function Card({ shine, radius = 22, style, children }) {
  return (
    <div
      data-bubble=""
      {...(shine ? { 'data-shinecard': '' } : {})}
      style={{ ...cardBase, borderRadius: radius, ...style }}
    >
      {shine && (
        <div
          data-shinefill=""
          style={{ position: 'absolute', inset: 0, borderRadius: radius, pointerEvents: 'none', backgroundImage: 'none' }}
        />
      )}
      {children}
    </div>
  );
}

export function TechTag({ children }) {
  return (
    <span
      style={{
        display: 'inline-flex', padding: '5px 11px', borderRadius: 8,
        background: 'rgba(140,170,255,0.1)', border: '1px solid rgba(140,170,255,0.25)',
        color: '#bccaea', fontFamily: MONO, fontSize: 11, letterSpacing: '.02em',
      }}
    >
      {children}
    </span>
  );
}

// ink-wipe CTA (white -> blue diagonal fill on hover, driven by the engine)
export function WipeButton({ href, label, note }) {
  const fill = {
    position: 'absolute', inset: 0, background: '#567cff',
    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
    whiteSpace: 'nowrap', fontFamily: FG, fontWeight: 700, fontSize: 13.5,
    clipPath: 'polygon(-40% 0%, -20% 0%, -40% 100%, -60% 100%)',
    transition: 'clip-path .38s cubic-bezier(.4,0,.2,1)', pointerEvents: 'none',
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginTop: 20, flexWrap: 'wrap' }}>
      <a
        href={href} target="_blank" rel="noopener" data-wipe-btn=""
        style={{
          position: 'relative', overflow: 'hidden', display: 'inline-block', background: '#fff', color: '#0a0c14',
          border: 'none', borderRadius: 12, padding: '10px 18px', fontFamily: FG, fontWeight: 700, fontSize: 13.5,
          cursor: 'pointer', textDecoration: 'none',
        }}
      >
        <span style={{ display: 'block', whiteSpace: 'nowrap' }}>{label}</span>
        <span data-wipe-fill="" style={fill}>{label}</span>
      </a>
      {note && <span style={{ fontFamily: MONO, fontSize: 11, color: '#6f7f95' }}>{note}</span>}
    </div>
  );
}

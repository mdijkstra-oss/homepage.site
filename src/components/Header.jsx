import React from 'react';
import { FG, MONO } from './ui.js';

export default function Header() {
  const cell = (on, glow) => ({ background: on, borderRadius: 1, ...(glow ? { boxShadow: glow } : {}) });
  const off = 'rgba(140,170,255,0.09)';
  return (
    <div data-chrome="" style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40, height: 58,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 26px',
      borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(12,14,19,0.42)',
      backdropFilter: 'blur(16px) saturate(1.4)', WebkitBackdropFilter: 'blur(16px) saturate(1.4)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, fontWeight: 700, fontSize: 16, color: '#eef2f8' }}>
        <span aria-hidden="true" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 6px)', gridAutoRows: '6px', gap: 2 }}>
          <span style={cell(off)} />
          <span style={cell('#9fd8f2', '0 0 7px rgba(140,210,240,0.75)')} />
          <span style={cell(off)} />
          <span style={cell(off)} />
          <span style={cell(off)} />
          <span style={cell('#7fc0e0', '0 0 7px rgba(120,190,225,0.65)')} />
          <span style={cell('#6aa6c4', '0 0 6px rgba(106,166,196,0.55)')} />
          <span style={cell('#74b2d2', '0 0 6px rgba(116,178,210,0.6)')} />
          <span style={cell('#88c8e8', '0 0 7px rgba(136,200,232,0.7)')} />
        </span>
        mdijkstra.dev
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: MONO, fontSize: 13 }}>
        <a className="navlink" href="https://www.linkedin.com/in/matthijn-dijkstra-65527199/" target="_blank" rel="noopener">LinkedIn</a>
        <span className="navlink">Resume</span>
        <a className="navlink" href="mailto:hire@mdijkstra.dev?subject=Let's%20build%20something">Contact</a>
      </div>
    </div>
  );
}

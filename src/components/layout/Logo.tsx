import type { CSSProperties } from 'react';

function cell(on: string, glow?: string): CSSProperties {
  return { background: on, borderRadius: 1, ...(glow ? { boxShadow: glow } : {}) };
}

const OFF = 'rgba(140,170,255,0.09)';

export default function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 11, fontWeight: 700, fontSize: 16, color: '#eef2f8' }}>
      <span aria-hidden="true" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 6px)', gridAutoRows: '6px', gap: 2 }}>
        <span style={cell(OFF)} />
        <span style={cell('#9fd8f2', '0 0 7px rgba(140,210,240,0.75)')} />
        <span style={cell(OFF)} />
        <span style={cell(OFF)} />
        <span style={cell(OFF)} />
        <span style={cell('#7fc0e0', '0 0 7px rgba(120,190,225,0.65)')} />
        <span style={cell('#6aa6c4', '0 0 6px rgba(106,166,196,0.55)')} />
        <span style={cell('#74b2d2', '0 0 6px rgba(116,178,210,0.6)')} />
        <span style={cell('#88c8e8', '0 0 7px rgba(136,200,232,0.7)')} />
      </span>
      mdijkstra.dev
    </div>
  );
}

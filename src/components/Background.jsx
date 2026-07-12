import React from 'react';
import { FG, MONO } from './ui.js';

// All fixed, behind-the-content layers: the Game-of-Life canvas, the spark
// burst canvas, ambient aurora/grid/vignette, and the snake-game HUD / count-in
// / game-over overlays. The engine wires into every data-* hook here.
export default function Background() {
  const goBtnBase = {
    cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 9, borderRadius: 13,
    padding: '12px 20px', fontFamily: FG, fontSize: 14, transition: 'transform .18s ease, border-color .18s ease, background .18s ease',
  };
  return (
    <>
      <canvas data-gol="" style={{ position: 'fixed', inset: 0, zIndex: 0, opacity: 0.42, pointerEvents: 'none' }} />
      <canvas data-burst="" style={{ position: 'fixed', inset: 0, zIndex: 57, pointerEvents: 'none' }} />
      <div data-hotspot="" style={{ position: 'fixed', left: 0, top: 0, width: 74, height: 74, borderRadius: '50%', transform: 'translate(-50%,-50%)', zIndex: 56, cursor: 'pointer' }} />

      <div data-hud="" style={{ position: 'fixed', top: 72, left: '50%', transform: 'translateX(-50%)', zIndex: 58, pointerEvents: 'none', fontFamily: MONO, fontSize: 13, letterSpacing: '.18em', color: '#bfe9cf', textShadow: '0 2px 14px rgba(0,0,0,0.7)', opacity: 0, transition: 'opacity .25s ease', whiteSpace: 'nowrap' }} />

      <div data-count="" style={{ position: 'fixed', inset: 0, zIndex: 59, display: 'none', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        <div data-count-num="" style={{ fontFamily: FG, fontWeight: 700, fontSize: 'clamp(90px,16vw,190px)', letterSpacing: '-.03em', color: '#f4f7fd', textShadow: '0 10px 60px rgba(0,0,0,0.75), 0 0 46px rgba(120,160,255,0.28)' }} />
      </div>

      <div data-gameover="" style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'none', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto', textAlign: 'center', padding: '42px 52px 38px', borderRadius: 26, background: 'linear-gradient(160deg, rgba(22,26,34,0.94), rgba(12,15,20,0.94))', border: '1px solid rgba(255,255,255,0.14)', boxShadow: '0 34px 90px rgba(0,0,0,0.62), inset 0 1px 0 rgba(255,255,255,0.16)', minWidth: 340 }}>
          <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '.34em', color: '#8fa0b8' }}>GAME OVER</div>
          <div data-go-badge="" style={{ visibility: 'hidden', marginTop: 12, fontFamily: MONO, fontSize: 11, letterSpacing: '.22em', color: '#7ff0c0' }}>★ NEW BEST</div>
          <div style={{ display: 'flex', gap: 48, justifyContent: 'center', marginTop: 16 }}>
            <div>
              <div data-go-score="" style={{ fontSize: 62, fontWeight: 700, color: '#f4f7fd', lineHeight: 1, letterSpacing: '-.02em' }}>0</div>
              <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '.2em', color: '#8fa0b8', marginTop: 9 }}>SCORE</div>
            </div>
            <div>
              <div data-go-best="" style={{ fontSize: 62, fontWeight: 700, color: '#9fb2cc', lineHeight: 1, letterSpacing: '-.02em' }}>0</div>
              <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '.2em', color: '#8fa0b8', marginTop: 9 }}>BEST</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 30 }}>
            <button data-go-again="" style={{ ...goBtnBase, background: '#fff', color: '#0a0c14', border: 'none', fontWeight: 700 }}>
              Play again <span style={{ fontFamily: MONO, fontSize: 11, opacity: .55 }}>SPACE</span>
            </button>
            <button data-go-quit="" style={{ ...goBtnBase, background: 'rgba(255,255,255,0.06)', color: '#d6def0', border: '1px solid rgba(255,255,255,0.18)', fontWeight: 600 }}>
              Return to work <span style={{ fontFamily: MONO, fontSize: 11, opacity: .55 }}>ESC</span>
            </button>
          </div>
        </div>
      </div>

      {/* ambient aurora / grid / vignette */}
      <div style={{ position: 'fixed', inset: '-25%', zIndex: 0, background: 'radial-gradient(38% 34% at 28% 22%, rgba(86,124,255,0.22), transparent 60%), radial-gradient(34% 30% at 80% 80%, rgba(178,84,255,0.15), transparent 60%)', filter: 'blur(52px)', animation: 'auroraDrift 20s ease-in-out infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(140,170,255,0.045) 1px,transparent 1px),linear-gradient(90deg,rgba(140,170,255,0.045) 1px,transparent 1px)', backgroundSize: '30px 30px', WebkitMaskImage: 'radial-gradient(140% 120% at 50% 26%,#000 56%,transparent 100%)', maskImage: 'radial-gradient(140% 120% at 50% 26%,#000 56%,transparent 100%)' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(64% 70% at 50% 46%, rgba(8,9,13,0.6), transparent 78%)' }} />
    </>
  );
}

import React, { useState } from 'react';
import { FG, MONO } from './ui.js';
import { PROMPTS } from '../data.js';

// The bottom chrome: "take a break" pill (engine-driven), chip rail and the
// composer input. `onJump` scrolls to a card via the engine; `onSend` submits a
// chat question; `busy` disables input while a reply streams.
export default function Composer({ onJump, onSend, busy }) {
  const [value, setValue] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const q = value.trim();
    if (!q || busy) return;
    onSend?.(q);
    setValue('');
  };

  return (
    <div data-chrome="" style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40, padding: '20px 16px 18px',
      background: 'linear-gradient(0deg, rgba(9,10,14,0.94) 58%, rgba(9,10,14,0.6) 82%, transparent 100%)',
      backdropFilter: 'blur(7px)', WebkitBackdropFilter: 'blur(7px)',
    }}>
      <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 11, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 58, overflow: 'hidden', pointerEvents: 'none', display: 'flex', alignItems: 'flex-start', padding: '3px 1px 0 14px', zIndex: 2 }}>
          <button data-break-pill="" style={{
            pointerEvents: 'none', flex: '0 0 auto', whiteSpace: 'nowrap', cursor: 'pointer', position: 'relative', overflow: 'hidden',
            display: 'inline-flex', alignItems: 'center', gap: 7, padding: '7px 14px', borderRadius: 999,
            background: 'linear-gradient(180deg, rgba(40,46,60,0.92), rgba(24,29,39,0.92))', border: '1px solid rgba(255,255,255,0.16)',
            color: '#d6def0', fontFamily: FG, fontWeight: 600, fontSize: 12.5, transform: 'translateY(150%)', transition: 'border-color .18s ease',
          }}>
            <span style={{ opacity: .9, fontSize: 11.5, color: '#ffb45e' }}>✸</span>Take a break
          </button>
        </div>

        <div className="chiprail" data-chiprail="" style={{
          display: 'flex', gap: 8, alignItems: 'center', overflowX: 'auto', padding: '3px 1px 1px',
          WebkitMaskImage: 'linear-gradient(90deg, #000 0, #000 calc(100% - 22px), transparent 100%)',
          maskImage: 'linear-gradient(90deg, #000 0, #000 calc(100% - 22px), transparent 100%)',
        }}>
          {PROMPTS.map((pill) => (
            <button key={pill.type} data-prompt-pill="" onClick={() => onJump(pill.type)} style={{
              flex: '0 0 auto', whiteSpace: 'nowrap', cursor: 'pointer', position: 'relative', overflow: 'hidden',
              display: 'inline-flex', alignItems: 'center', gap: 7, padding: '7px 14px', borderRadius: 999,
              background: 'linear-gradient(180deg, rgba(40,46,60,0.92), rgba(24,29,39,0.92))', border: '1px solid rgba(255,255,255,0.16)',
              color: '#d6def0', fontFamily: FG, fontWeight: 600, fontSize: 12.5, transition: 'border-color .18s ease',
            }}>
              <span data-pill-icon="" style={{ opacity: .9, fontSize: 11.5 }}>{pill.icon}</span>{pill.label}
            </button>
          ))}
        </div>

        <form onSubmit={submit} style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '15px 17px',
          background: 'linear-gradient(180deg, rgba(28,33,44,0.45), rgba(16,20,27,0.4))', border: '1px solid rgba(255,255,255,0.16)',
          borderRadius: 15, backdropFilter: 'blur(16px) saturate(1.4)', WebkitBackdropFilter: 'blur(16px) saturate(1.4)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 0 0 4px rgba(120,160,230,0.045), 0 14px 34px rgba(0,0,0,0.4)',
        }}>
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ask anything about Matthijn"
            disabled={busy}
            className="composer-input"
            style={{
              flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none',
              color: '#eaf0ff', fontFamily: MONO, fontSize: 13.5,
            }}
          />
          <button type="submit" data-send="" disabled={busy || !value.trim()} style={{
            background: 'none', border: 'none', padding: 0, cursor: busy || !value.trim() ? 'default' : 'pointer',
            color: '#6aa6c4', fontFamily: MONO, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
            opacity: busy || !value.trim() ? 0.45 : 1, transition: 'opacity .15s ease',
          }}>
            {busy ? '…' : '↵ send'}
          </button>
        </form>
      </div>
    </div>
  );
}

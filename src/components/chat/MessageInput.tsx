import { useRef, useState, type FormEvent, type KeyboardEvent, type RefObject } from 'react';
import { MONO } from '../primitives/theme';

const INPUT_MAX_H = 132; // ~6 lines before the textarea scrolls

interface MessageInputProps {
  onSend: (text: string) => void;
  busy: boolean;
  sendButtonRef: RefObject<HTMLButtonElement>;
}

export default function MessageInput({ onSend, busy, sendButtonRef }: MessageInputProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Grow the textarea to fit its content, up to INPUT_MAX_H then scroll.
  const autoGrow = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, INPUT_MAX_H) + 'px';
  };

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    const q = value.trim();
    if (!q || busy) return;
    onSend(q);
    setValue('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
  };

  // Enter sends, Shift+Enter inserts a newline.
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form onSubmit={submit} style={{
      display: 'flex', alignItems: 'flex-end', gap: 10, padding: '15px 17px',
      background: 'linear-gradient(180deg, rgba(28,33,44,0.45), rgba(16,20,27,0.4))', border: '1px solid rgba(255,255,255,0.16)',
      borderRadius: 15, backdropFilter: 'blur(16px) saturate(1.4)', WebkitBackdropFilter: 'blur(16px) saturate(1.4)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 0 0 4px rgba(120,160,230,0.045), 0 14px 34px rgba(0,0,0,0.4)',
    }}>
      <textarea
        autoFocus
        ref={inputRef}
        rows={1}
        value={value}
        onChange={(e) => { setValue(e.target.value); autoGrow(e.target); }}
        onKeyDown={onKeyDown}
        placeholder="Ask anything about Matthijn"
        disabled={busy}
        className="composer-input"
        style={{
          flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', resize: 'none',
          color: '#eaf0ff', fontFamily: MONO, fontSize: 13.5, lineHeight: 1.5,
          maxHeight: INPUT_MAX_H, overflowY: 'auto', padding: 0, margin: 0, display: 'block',
        }}
      />
      <button ref={sendButtonRef} type="submit" disabled={busy || !value.trim()} style={{
        background: 'none', border: 'none', padding: 0, cursor: busy || !value.trim() ? 'default' : 'pointer',
        color: '#6aa6c4', fontFamily: MONO, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', lineHeight: '21px',
        opacity: busy || !value.trim() ? 0.45 : 1, transition: 'opacity .15s ease',
      }}>
        {busy ? '…' : '↵ send'}
      </button>
    </form>
  );
}

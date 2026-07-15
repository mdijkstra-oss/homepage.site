import { useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent, type RefObject } from 'react';
import styles from './MessageInput.module.css';

const INPUT_MAX_HEIGHT = 132;

interface MessageInputProps {
  onSend: (text: string) => void;
  busy: boolean;
  sendButtonRef: RefObject<HTMLButtonElement>;
}

export default function MessageInput({ onSend, busy, sendButtonRef }: MessageInputProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const resizeInput = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, INPUT_MAX_HEIGHT) + 'px';
  };

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    const q = value.trim();
    if (!q || busy) return;
    onSend(q);
    setValue('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
  };

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
    resizeInput(event.target);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const isSendDisabled = busy || !value.trim();

  return (
    <form onSubmit={submit} className={styles.form}>
      <textarea
        autoFocus
        ref={inputRef}
        rows={1}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything about Matthijn"
        disabled={busy}
        className={styles.textarea}
      />
      <button ref={sendButtonRef} type="submit" disabled={isSendDisabled} className={styles.send}>
        {busy ? '…' : '↵ send'}
      </button>
    </form>
  );
}

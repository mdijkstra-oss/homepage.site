import { type ChangeEvent, type FormEvent, type KeyboardEvent, type RefObject, useRef, useState } from 'react';
import { SITE } from '../../../../content/site';
import styles from './MessageInput.module.css';

const INPUT_MAX_HEIGHT = 132;

/**
 * Focusing on load saves a click with a mouse. On a touch screen it throws the
 * keyboard over the page before the reader has seen any of it.
 */
function prefersFocusOnLoad(): boolean {
  return window.matchMedia?.('(pointer: fine)').matches ?? false;
}

interface MessageInputProps {
  onSend: (text: string) => void;
  isGeneratingResponse: boolean;
  sendButtonRef: RefObject<HTMLButtonElement>;
}

export default function MessageInput({ onSend, isGeneratingResponse, sendButtonRef }: MessageInputProps) {
  const [value, setValue] = useState('');
  const [focusOnLoad] = useState(prefersFocusOnLoad);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const resizeInput = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, INPUT_MAX_HEIGHT)}px`;
  };

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    const q = value.trim();
    if (!q || isGeneratingResponse) return;
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

  const isSendDisabled = isGeneratingResponse || !value.trim();

  return (
    <form onSubmit={submit} className={styles.form}>
      <textarea
        autoFocus={focusOnLoad}
        ref={inputRef}
        rows={1}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={SITE.composer.placeholder}
        disabled={isGeneratingResponse}
        className={styles.textarea}
      />
      <button ref={sendButtonRef} type="submit" disabled={isSendDisabled} className={styles.send}>
        {isGeneratingResponse ? SITE.composer.busy : SITE.composer.send}
      </button>
    </form>
  );
}

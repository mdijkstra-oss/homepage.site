import {
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import { SITE } from '../../../../content/site';
import styles from './MessageInput.module.css';

const INPUT_MAX_HEIGHT = 132;

/**
 * A mouse can hold focus for free. On a touch screen focus means the keyboard
 * covers the page, so the input takes it only while the reader is typing.
 */
function hasFinePointer(): boolean {
  return window.matchMedia?.('(pointer: fine)').matches ?? false;
}

interface MessageInputProps {
  onSend: (text: string) => void;
  isGeneratingResponse: boolean;
  sendButtonRef: RefObject<HTMLButtonElement>;
}

export default function MessageInput({ onSend, isGeneratingResponse, sendButtonRef }: MessageInputProps) {
  const [value, setValue] = useState('');
  const [finePointer] = useState(hasFinePointer);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const wasGenerating = useRef(false);

  useEffect(() => {
    if (finePointer && wasGenerating.current && !isGeneratingResponse) inputRef.current?.focus();
    wasGenerating.current = isGeneratingResponse;
  }, [finePointer, isGeneratingResponse]);

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
    if (!finePointer) inputRef.current?.blur();
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
        autoFocus={finePointer}
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

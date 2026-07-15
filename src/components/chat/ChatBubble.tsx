import { useLayoutEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './ChatBubble.module.css';
import { Row } from '../primitives/Row';
import { clearPointerSpotlight, paintPointerSpotlight } from '../effects/pointerSpotlight';
import type { BubbleRegister } from '../../engine/types';
import type { ChatRole } from '../../data/blocks';

const THINKING = [
  'Thinking', 'Pondering', 'Mulling it over', 'Reflecting', 'Considering',
  'Gathering thoughts', 'Digging in', 'Working it out', 'Piecing it together', 'One sec',
];
const pickThinking = () => THINKING[Math.floor(Math.random() * THINKING.length)];


function useLiveBubbleRegistration(live?: boolean, register?: BubbleRegister) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!live || !register) return;
    const el = ref.current;
    register.add(el);
    return () => register.remove(el);
  }, [live, register]);
  return ref;
}

export interface ChatBubbleProps {
  role: ChatRole;
  text: string;
  live?: boolean;
  register?: BubbleRegister;
}

export default function ChatBubble({ role, text, live, register }: ChatBubbleProps) {
  const ref = useLiveBubbleRegistration(live, register);
  const fillRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<string | null>(null);
  if (wordRef.current === null) wordRef.current = pickThinking();
  const bubbleClassName = `${styles.bubble} ${styles[role]}${live ? '' : ` ${styles.hidden}`}`;

  return (
    <Row alignment={role === 'user' ? 'end' : 'start'}>
      <div
        ref={ref}
        data-bubble=""
        onPointerMove={(event) => fillRef.current && paintPointerSpotlight(fillRef.current, event)}
        onPointerLeave={() => fillRef.current && clearPointerSpotlight(fillRef.current)}
        className={bubbleClassName}
      >
        <div ref={fillRef} className={styles.spotlight} />
        {role === 'assistant'
          ? (text
            ? <div className={styles.markdown}><ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown></div>
            : <span className={styles.thinking}>{wordRef.current}…</span>)
          : text}
      </div>
    </Row>
  );
}

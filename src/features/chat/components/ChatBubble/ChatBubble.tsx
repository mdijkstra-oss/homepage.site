import { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import spotlightStyles from '../../../../components/effects/PointerSpotlight/PointerSpotlight.module.css';
import {
  clearPointerSpotlight,
  paintPointerSpotlight,
} from '../../../../components/effects/PointerSpotlight/pointerSpotlight';
import { Row } from '../../../../components/primitives/Row/Row';
import type { ChatRole } from '../../conversation/messages';
import styles from './ChatBubble.module.css';

const THINKING = [
  'Thinking',
  'Pondering',
  'Mulling it over',
  'Reflecting',
  'Considering',
  'Gathering thoughts',
  'Digging in',
  'Working it out',
  'Piecing it together',
  'One sec',
];
const pickThinking = () => THINKING[Math.floor(Math.random() * THINKING.length)];

export interface ChatBubbleProps {
  speaker: ChatRole;
  text: string;
}

export default function ChatBubble({ speaker, text }: ChatBubbleProps) {
  const fillRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<string | null>(null);
  if (wordRef.current === null) wordRef.current = pickThinking();
  const bubbleClassName = `${styles.bubble} ${styles[speaker]}`;

  return (
    <Row alignment={speaker === 'user' ? 'end' : 'start'}>
      <div
        onPointerMove={(event) => fillRef.current && paintPointerSpotlight(fillRef.current, event)}
        onPointerLeave={() => fillRef.current && clearPointerSpotlight(fillRef.current)}
        className={bubbleClassName}
      >
        <div ref={fillRef} className={spotlightStyles.spotlight} />
        {speaker === 'assistant' ? (
          text ? (
            <div className={styles.markdown}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
            </div>
          ) : (
            <span className={styles.thinking}>{wordRef.current}…</span>
          )
        ) : (
          text
        )}
      </div>
    </Row>
  );
}

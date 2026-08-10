import { memo, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import spotlightStyles from '../../../../components/effects/PointerSpotlight/PointerSpotlight.module.css';
import {
  clearPointerSpotlight,
  paintPointerSpotlight,
} from '../../../../components/effects/PointerSpotlight/pointerSpotlight';
import { Row } from '../../../../components/primitives/Row/Row';
import { SITE } from '../../../../content/site';
import type { ChatRole } from '../../conversation/messages';
import styles from './ChatBubble.module.css';

const pickThinking = () => SITE.thinkingWords[Math.floor(Math.random() * SITE.thinkingWords.length)];

export interface ChatBubbleProps {
  speaker: ChatRole;
  text: string;
}

// Memoized so a streaming delta re-renders only the bubble it lands in; every
// other bubble on the page keeps its parsed markdown.
export default memo(ChatBubble);

function ChatBubble({ speaker, text }: ChatBubbleProps) {
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

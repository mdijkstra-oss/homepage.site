import { memo, useEffect, useRef, useState } from 'react';
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

// A cold backend instance can take several seconds to answer, and the model
// reasons before it emits any text. One frozen word through all of that reads
// as a hung page, so the wait advances through the list and stops on the last.
const THINKING_STEP_MS = 2500;

function useThinkingWord(waiting: boolean): string {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!waiting) return;
    const timer = setInterval(
      () => setStep((current) => Math.min(current + 1, SITE.thinkingWords.length - 1)),
      THINKING_STEP_MS,
    );
    return () => clearInterval(timer);
  }, [waiting]);

  return SITE.thinkingWords[step];
}

export interface ChatBubbleProps {
  speaker: ChatRole;
  text: string;
}

// Memoized so a streaming delta re-renders only the bubble it lands in; every
// other bubble on the page keeps its parsed markdown.
export default memo(ChatBubble);

function ChatBubble({ speaker, text }: ChatBubbleProps) {
  const fillRef = useRef<HTMLDivElement>(null);
  const thinkingWord = useThinkingWord(speaker === 'assistant' && !text);
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
            <span className={styles.thinking}>{thinkingWord}…</span>
          )
        ) : (
          text
        )}
      </div>
    </Row>
  );
}

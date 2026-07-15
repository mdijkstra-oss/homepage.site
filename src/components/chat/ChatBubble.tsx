import { useLayoutEffect, useRef, type CSSProperties } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Row } from '../primitives/Row';
import { MONO } from '../primitives/theme';
import { clearPointerSpotlight, paintPointerSpotlight } from '../effects/pointerSpotlight';
import { BUBBLE_STYLES } from '../../chat/style';
import type { BubbleRegister } from '../../types/engine';
import type { ChatRole } from '../../types/blocks';

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
  const s = BUBBLE_STYLES[role];

  return (
    <Row end={s.end}>
      <div
        ref={ref}
        data-bubble=""
        onPointerMove={(event) => fillRef.current && paintPointerSpotlight(fillRef.current, event)}
        onPointerLeave={() => fillRef.current && clearPointerSpotlight(fillRef.current)}
        style={{
          position: 'relative', maxWidth: s.maxWidth, opacity: live ? undefined : 0,
          background: s.background, border: s.border, borderRadius: s.borderRadius,
          boxShadow: s.boxShadow, padding: s.padding, color: s.color, fontSize: 14, lineHeight: 1.6,
        } as CSSProperties}
      >
        <div ref={fillRef} style={{ position: 'absolute', inset: 0, borderRadius: s.borderRadius, pointerEvents: 'none', backgroundImage: 'none' }} />
        {role === 'assistant'
          ? (text
            ? <div className="md"><ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown></div>
            : <span style={{ color: '#8fa3bd', fontFamily: MONO, fontSize: 13, animation: 'blink 1.3s steps(1) infinite' }}>{wordRef.current}…</span>)
          : text}
      </div>
    </Row>
  );
}

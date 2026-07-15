import { useLayoutEffect, useRef, type CSSProperties } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Row } from '../primitives/Row';
import { MONO } from '../primitives/theme';
import { shineOnLeave, shineOnMove } from '../effects/shine';
import type { BubbleRegister } from '../../types/engine';
import type { ChatRole } from '../../types/blocks';

// Shown in an assistant bubble until the first token streams in. One is picked
// at random per reply, so successive answers feel a little different.
const THINKING = [
  'Thinking', 'Pondering', 'Mulling it over', 'Reflecting', 'Considering',
  'Gathering thoughts', 'Digging in', 'Working it out', 'Piecing it together', 'One sec',
];
const pickThinking = () => THINKING[Math.floor(Math.random() * THINKING.length)];

interface BubbleStyle {
  end: boolean;
  maxWidth: string;
  background: string;
  border: string;
  borderRadius: string;
  boxShadow: string;
  padding: string;
  color: string;
  lineHeight: number;
}

const BUBBLE_STYLES: Record<ChatRole, BubbleStyle> = {
  user: {
    end: true, maxWidth: '64%',
    background: 'linear-gradient(140deg, rgba(86,124,255,0.3), rgba(86,124,255,0.12)), linear-gradient(rgba(10,16,34,0.4), rgba(10,16,34,0.4))',
    border: '1px solid rgba(140,170,255,0.45)', borderRadius: '16px 16px 6px 16px',
    boxShadow: '0 8px 22px rgba(20,40,120,0.3)', padding: '13px 17px', color: '#eaf0ff', lineHeight: 1.55,
  },
  assistant: {
    end: false, maxWidth: '74%',
    background: 'linear-gradient(140deg, rgba(255,255,255,0.085), rgba(255,255,255,0.03)), linear-gradient(rgba(12,14,19,0.5), rgba(12,14,19,0.5))',
    border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px 16px 16px 6px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.35)', padding: '14px 17px', color: '#d2dae6', lineHeight: 1.62,
  },
};

// `live` bubbles are appended after the engine mounted. `register` hands their
// DOM node to the engine (useLayoutEffect: before paint, so no flash) so they
// reveal, shine and fly away exactly like the preloaded blocks. For live
// bubbles the engine owns opacity/transform, so those are left out of the JSX
// style (otherwise React would fight the engine on every stream re-render).
function useEngineBubble(live?: boolean, register?: BubbleRegister) {
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
  const ref = useEngineBubble(live, register);
  const fillRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<string | null>(null);
  if (wordRef.current === null) wordRef.current = pickThinking();
  const s = BUBBLE_STYLES[role];

  return (
    <Row end={s.end}>
      <div
        ref={ref}
        data-bubble=""
        onPointerMove={(e) => fillRef.current && shineOnMove(fillRef.current, e)}
        onPointerLeave={() => fillRef.current && shineOnLeave(fillRef.current)}
        style={{
          position: 'relative', maxWidth: s.maxWidth, opacity: live ? undefined : 0,
          background: s.background, border: s.border, borderRadius: s.borderRadius,
          boxShadow: s.boxShadow, padding: s.padding, color: s.color, fontSize: 14, lineHeight: s.lineHeight,
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

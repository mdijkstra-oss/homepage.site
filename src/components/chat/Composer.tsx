import { useRef, type MouseEvent } from 'react';
import PillRail from './PillRail';
import Pill from './Pill';
import ProximityReveal from '../effects/ProximityReveal';
import MessageInput from './MessageInput';
import type { BlockType } from '../../types/blocks';

interface ComposerProps {
  onJump: (type: BlockType) => void;
  onSend: (text: string) => void;
  busy: boolean;
  breakLabel: string;
  breakCanShow: boolean;
  onBreakPillClick: (origin: { x: number; y: number }) => void;
}

export default function Composer({ onJump, onSend, busy, breakLabel, breakCanShow, onBreakPillClick }: ComposerProps) {
  const sendRef = useRef<HTMLButtonElement>(null);

  const handleBreakClick = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    onBreakPillClick({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };

  return (
    <div data-chrome="" style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40, padding: '20px 16px 18px',
      background: 'linear-gradient(0deg, rgba(9,10,14,0.94) 58%, rgba(9,10,14,0.6) 82%, transparent 100%)',
      backdropFilter: 'blur(7px)', WebkitBackdropFilter: 'blur(7px)',
    }}>
      <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 11, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 58, overflow: 'hidden', pointerEvents: 'none', display: 'flex', alignItems: 'flex-start', padding: '3px 1px 0 14px', zIndex: 2 }}>
          <ProximityReveal target={sendRef} disabled={!breakCanShow}>
            <Pill
              icon="✸"
              label={breakLabel}
              iconColor="#ffb45e"
              hoverBg="linear-gradient(180deg, rgba(96,52,20,0.95), rgba(66,36,14,0.92))"
              hoverColor="#ffd9ae"
              hoverBorder="rgba(255,172,82,0.55)"
              onClick={handleBreakClick}
            />
          </ProximityReveal>
        </div>

        <PillRail onJump={onJump} />
        <MessageInput onSend={onSend} busy={busy} sendButtonRef={sendRef} />
      </div>
    </div>
  );
}

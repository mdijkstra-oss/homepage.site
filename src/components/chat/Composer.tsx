import { type MouseEvent, useRef } from 'react';
import type { BlockType } from '../../data/blocks';
import ProximityReveal from '../effects/ProximityReveal';
import styles from './Composer.module.css';
import MessageInput from './MessageInput';
import Pill from './Pill';
import PillRail from './PillRail';

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
    <div data-chrome="" className={styles.composer}>
      <div className={styles.content}>
        <div className={styles.break}>
          <ProximityReveal target={sendRef} disabled={!breakCanShow}>
            {(interaction) => (
              <Pill
                {...interaction}
                icon="✸"
                label={breakLabel}
                iconColor="#ffb45e"
                hoverBg="linear-gradient(180deg, rgba(96,52,20,0.95), rgba(66,36,14,0.92))"
                hoverColor="#ffd9ae"
                hoverBorder="rgba(255,172,82,0.55)"
                onClick={handleBreakClick}
              />
            )}
          </ProximityReveal>
        </div>

        <PillRail onJump={onJump} />
        <MessageInput onSend={onSend} busy={busy} sendButtonRef={sendRef} />
      </div>
    </div>
  );
}

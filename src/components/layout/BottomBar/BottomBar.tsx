import { type MouseEvent, useRef } from 'react';
import MessageInput from '../../../features/chat/components/MessageInput/MessageInput';
import PillRail from '../../../features/portfolio/PillRail/PillRail';
import ProximityReveal from '../../effects/ProximityReveal/ProximityReveal';
import Pill from '../../primitives/Pill/Pill';
import styles from './BottomBar.module.css';

interface ComposerProps {
  onSend: (text: string) => void;
  isGeneratingResponse: boolean;
  breakLabel: string;
  breakCanShow: boolean;
  onBreakPillClick: (origin: { x: number; y: number }) => void;
}

export default function BottomBar({
  onSend,
  isGeneratingResponse,
  breakLabel,
  breakCanShow,
  onBreakPillClick,
}: ComposerProps) {
  const sendRef = useRef<HTMLButtonElement>(null);

  const handleBreakClick = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    onBreakPillClick({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };

  return (
    <div data-fly-away="" className={styles.composer}>
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
                onClick={handleBreakClick}
              />
            )}
          </ProximityReveal>
        </div>

        <PillRail />
        <MessageInput onSend={onSend} isGeneratingResponse={isGeneratingResponse} sendButtonRef={sendRef} />
      </div>

      <p className={styles.disclaimer}>
        This chat uses AI. Answers can be wrong. <a href="/privacy.txt">Privacy</a>
      </p>
    </div>
  );
}

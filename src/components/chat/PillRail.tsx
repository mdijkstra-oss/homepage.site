import styles from './PillRail.module.css';
import Pill from './Pill';
import { PROMPT_PILLS } from '../theme/palette';
import type { BlockType } from '../../data/blocks';

export default function PillRail({ onJump }: { onJump: (type: BlockType) => void }) {
  return (
    <div className={styles.rail}>
      {PROMPT_PILLS.map((pill) => (
        <Pill
          key={pill.type}
          icon={pill.palette.icon}
          label={pill.label}
          iconColor={pill.palette.color}
          hoverBg={pill.palette.background}
          hoverColor={pill.palette.color}
          hoverBorder={pill.palette.border}
          onClick={() => onJump(pill.type)}
        />
      ))}
    </div>
  );
}

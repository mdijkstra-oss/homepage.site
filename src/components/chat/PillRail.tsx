import type { BlockType } from '../../data/blocks';
import { PROMPT_PILLS } from '../theme/palette';
import Pill from './Pill';
import styles from './PillRail.module.css';

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
          onClick={() => onJump(pill.type)}
        />
      ))}
    </div>
  );
}

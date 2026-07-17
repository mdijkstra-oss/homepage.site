import Pill from '../../../components/primitives/Pill/Pill';
import { PROMPT_PILLS } from '../model/palette';
import styles from './PillRail.module.css';

export default function PillRail() {
  return (
    <div className={styles.rail}>
      {PROMPT_PILLS.map((pill) => (
        <Pill
          key={pill.section}
          href={`#${pill.section}`}
          icon={pill.palette.icon}
          label={pill.label}
          iconColor={pill.palette.color}
          hoverBg={pill.palette.background}
          hoverColor={pill.palette.color}
        />
      ))}
    </div>
  );
}

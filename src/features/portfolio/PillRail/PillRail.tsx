import Pill from '../../../components/primitives/Pill/Pill';
import { SECTIONS } from '../../../content/site';
import { selectPromptPills } from '../model/promptPills';
import styles from './PillRail.module.css';

const PROMPT_PILLS = selectPromptPills(SECTIONS);

export default function PillRail() {
  return (
    <div className={styles.rail}>
      {PROMPT_PILLS.map((pill) => (
        <Pill
          key={pill.section}
          href={`#${pill.section}`}
          icon={pill.palette.icon}
          label={pill.label}
          iconColor={pill.palette.accent}
          hoverBg={pill.palette.background}
          hoverColor={pill.palette.color}
        />
      ))}
    </div>
  );
}

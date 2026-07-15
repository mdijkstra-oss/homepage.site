import Pill from './Pill';
import { PILLS } from '../../data/theme';
import type { BlockType } from '../../types/blocks';

export default function PillRail({ onJump }: { onJump: (type: BlockType) => void }) {
  return (
    <div className="chiprail" style={{
      display: 'flex', gap: 8, alignItems: 'center', overflowX: 'auto', padding: '3px 1px 1px',
      WebkitMaskImage: 'linear-gradient(90deg, #000 0, #000 calc(100% - 22px), transparent 100%)',
      maskImage: 'linear-gradient(90deg, #000 0, #000 calc(100% - 22px), transparent 100%)',
    }}>
      {PILLS.map((pill) => (
        <Pill
          key={pill.type}
          icon={pill.icon}
          label={pill.label}
          iconColor={pill.iconColor}
          hoverBg={pill.hoverBg}
          hoverColor={pill.hoverColor}
          hoverBorder={pill.hoverBorder}
          onClick={() => onJump(pill.type)}
        />
      ))}
    </div>
  );
}

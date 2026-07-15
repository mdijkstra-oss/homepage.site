import type { BlockType } from './blocks';

export interface PromptPill {
  type: BlockType;
  icon: string;
  label: string;
  iconColor: string;
  hoverBorder: string;
  hoverBg: string;
  hoverColor: string;
}

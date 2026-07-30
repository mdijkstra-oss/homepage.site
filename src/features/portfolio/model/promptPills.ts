import { type AccentPalette, SECTION_PALETTES } from './palette';
import type { ContentSection, SectionId } from './types';

export interface PromptPill {
  section: SectionId;
  label: string;
  palette: AccentPalette;
}

export function selectPromptPills(sections: readonly ContentSection[]): PromptPill[] {
  return sections.flatMap((section) =>
    section.pillLabel ? [{ section: section.id, label: section.pillLabel, palette: SECTION_PALETTES[section.id] }] : [],
  );
}

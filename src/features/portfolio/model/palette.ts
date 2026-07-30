import type { SectionId } from './types';

export interface AccentPalette {
  background: string;
  color: string;
  icon: string;
}

export type BadgeKind = 'profile' | 'role' | 'note' | 'experience' | 'also' | 'education' | 'reviews' | 'approach';

const BLUE: AccentPalette = {
  background: 'linear-gradient(180deg, rgba(34,52,104,0.95), rgba(22,34,70,0.92))',
  color: '#d7e2ff',
  icon: '◆',
};

export const BADGE_PALETTES: Record<BadgeKind, AccentPalette> = {
  profile: {
    background: 'linear-gradient(180deg, rgba(30,74,54,0.95), rgba(19,52,38,0.92))',
    color: '#c4f7da',
    icon: '●',
  },
  role: {
    background: 'linear-gradient(180deg, rgba(64,40,110,0.95), rgba(44,28,78,0.92))',
    color: '#e2d4ff',
    icon: '✚',
  },
  note: BLUE,
  experience: BLUE,
  also: {
    background: 'linear-gradient(180deg, rgba(40,48,62,0.96), rgba(26,32,42,0.92))',
    color: '#dce6f4',
    icon: '✦',
  },
  education: {
    background: 'linear-gradient(180deg, rgba(20,72,80,0.95), rgba(14,50,56,0.92))',
    color: '#c2eef5',
    icon: '⌂',
  },
  reviews: {
    background: 'linear-gradient(180deg, rgba(10,66,124,0.96), rgba(8,46,90,0.92))',
    color: '#cfe3ff',
    icon: '★',
  },
  approach: {
    background: 'linear-gradient(180deg, rgba(96,32,72,0.95), rgba(66,22,50,0.92))',
    color: '#ffd2e8',
    icon: '✦',
  },
};

export const SECTION_PALETTES: Record<SectionId, AccentPalette> = {
  profile: BADGE_PALETTES.profile,
  experience: BADGE_PALETTES.role,
  reviews: BADGE_PALETTES.reviews,
  approach: BADGE_PALETTES.approach,
  history: BADGE_PALETTES.note,
  education: BADGE_PALETTES.education,
};

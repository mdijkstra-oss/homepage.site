export interface ProfilePayload {
  initials: string;
  photo?: string;
  name: string;
  label: string;
  bio: string;
  badge: string;
  availability: string;
  cta: string;
  note: string;
  noteHover: string;
  email: string;
  emailSubject: string;
}

export type RolePara = { text: string } | { pre: string; linkText: string; url: string; post: string };

export interface RoleStat {
  value: string;
  label: string;
  note: string;
  href: string;
}

export interface RoleFootnote {
  n: string;
  text: string;
  url: string;
}

export interface RolePayload {
  badge: string;
  logo?: string;
  initials?: string;
  name: string;
  meta: string;
  paragraphs: RolePara[];
  stats?: RoleStat[];
  tech?: string[];
  cta?: string;
  ctaNote?: string;
  href?: string;
  footnotes?: RoleFootnote[];
}

export interface Review {
  initials: string;
  name: string;
  photo: string;
  role: string;
  url: string;
  quote: string;
}

export interface ReviewsPayload {
  badge: string;
  title: string;
  subtitle: string;
  items: Review[];
}

export interface ApproachItem {
  idx: string;
  lead: string;
  body: string;
}

export interface ApproachPayload {
  badge: string;
  title: string;
  intro: string;
  items: ApproachItem[];
}

export interface NoteLoop {
  label: string;
  steps: readonly string[];
}

export interface NotePayload {
  badge?: string;
  eyebrow: string;
  title: string;
  paragraphs: string[];
  loop?: NoteLoop;
}

export interface EducationRow {
  img?: string;
  url?: string;
  initials?: string;
  degree: string;
  school: string;
  year: string;
}

export interface EducationPayload {
  badge: string;
  title: string;
  subtitle: string;
  items: EducationRow[];
}

export interface ExperiencePayload {
  badge: string;
  video: string;
  name: string;
  meta: string;
  blurb: string;
  tech?: string[];
  cta?: string;
  ctaNote?: string;
  href?: string;
}

export interface AlsoItem {
  idx: string;
  name: string;
  desc: string;
  tech: string;
}

export interface AlsoPayload {
  badge: string;
  title: string;
  subtitle: string;
  items: AlsoItem[];
}

export type CardBlock =
  | { type: 'profile'; payload: ProfilePayload }
  | { type: 'role'; payload: RolePayload }
  | { type: 'reviews'; payload: ReviewsPayload }
  | { type: 'approach'; payload: ApproachPayload }
  | { type: 'note'; payload: NotePayload }
  | { type: 'education'; payload: EducationPayload }
  | { type: 'experience'; payload: ExperiencePayload }
  | { type: 'also'; payload: AlsoPayload };

export type SectionId = 'profile' | 'experience' | 'projects' | 'reviews' | 'approach' | 'history' | 'education';

export interface ContentSection {
  id: SectionId;
  pillLabel?: string;
  prompt: string;
  blocks: readonly CardBlock[];
}

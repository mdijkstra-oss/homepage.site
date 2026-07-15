// The content model: one discriminated union for every block the feed can hold.
// `user`/`assistant` are chat bubbles (carry `text`); every other type is a
// content card (carries a typed `payload`). The union is what makes the card
// dispatcher exhaustive — a new type is a compile error until it's handled.

export interface ProfilePayload {
  initials: string;
  name: string;
  label: string;
  bio: string;
  badge: string;
  cta: string;
  note: string;
  email: string;
  emailSubject: string;
}

export type RolePara =
  | { text: string }
  | { pre: string; linkText: string; url: string; post: string };

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
  paras: RolePara[];
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
  title: string;
  intro: string;
  items: ApproachItem[];
}

export interface NotePayload {
  badge?: string;
  eyebrow: string;
  title: string;
  paras: string[];
  loop?: string[];
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
  title: string;
  subtitle: string;
  items: EducationRow[];
}

export interface ExperiencePayload {
  video: string;
  name: string;
  meta: string;
  blurb: string;
  tech?: string[];
}

export interface AlsoItem {
  idx: string;
  name: string;
  desc: string;
  tech: string;
}

export interface AlsoPayload {
  title: string;
  subtitle: string;
  items: AlsoItem[];
}

export type Block =
  | { type: 'user'; text: string }
  | { type: 'assistant'; text: string }
  | { type: 'profile'; payload: ProfilePayload }
  | { type: 'role'; payload: RolePayload }
  | { type: 'reviews'; payload: ReviewsPayload }
  | { type: 'approach'; payload: ApproachPayload }
  | { type: 'note'; payload: NotePayload }
  | { type: 'education'; payload: EducationPayload }
  | { type: 'experience'; payload: ExperiencePayload }
  | { type: 'also'; payload: AlsoPayload };

export type BlockType = Block['type'];

// The block types that can appear as a live chat bubble.
export type ChatRole = 'user' | 'assistant';

// Every block except the two chat-bubble types — what the card dispatcher handles.
export type CardBlock = Exclude<Block, { type: ChatRole }>;

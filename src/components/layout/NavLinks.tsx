import type { ReactNode } from 'react';
import { assertNever } from '../../lib/assertNever';
import styles from './NavLinks.module.css';

export default function NavLinks() {
  return (
    <div className={styles.links}>
      {NAV_ITEMS.map((item) => (
        <NavEntry key={item.label} item={item} />
      ))}
    </div>
  );
}

type NavIconKind = 'linkedin' | 'resume' | 'contact';

interface NavItem {
  label: string;
  icon: NavIconKind;
  href?: string;
  target?: '_blank';
  rel?: 'noopener';
}

const NAV_ITEMS: readonly NavItem[] = [
  {
    label: 'LinkedIn',
    icon: 'linkedin',
    href: 'https://www.linkedin.com/in/matthijn-dijkstra-65527199/',
    target: '_blank',
    rel: 'noopener',
  },
  { label: 'Resume', icon: 'resume' },
  { label: 'Contact', icon: 'contact', href: "mailto:hire@mdijkstra.dev?subject=Let's%20build%20something" },
];

function NavEntry({ item }: { item: NavItem }) {
  const content = (
    <>
      <NavIcon kind={item.icon} />
      <span>{item.label}</span>
    </>
  );

  if (!item.href) return <span className={styles.link}>{content}</span>;

  return (
    <a className={styles.link} href={item.href} target={item.target} rel={item.rel}>
      {content}
    </a>
  );
}

function NavIcon({ kind }: { kind: NavIconKind }) {
  return (
    <svg className={styles.icon} data-icon={kind} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {navIconPaths(kind)}
    </svg>
  );
}

function navIconPaths(kind: NavIconKind): ReactNode {
  switch (kind) {
    case 'linkedin':
      return (
        <>
          <path d="M6 9v9" />
          <path d="M6 6v.01" />
          <path d="M10.5 18v-5.25a4 4 0 0 1 8 0V18" />
          <path d="M10.5 9v9" />
        </>
      );
    case 'resume':
      return (
        <>
          <path d="M7 3.5h7l4 4v13H7z" />
          <path d="M14 3.5v4h4" />
          <path d="M10 12h5" />
          <path d="M10 16h5" />
        </>
      );
    case 'contact':
      return (
        <>
          <path d="M3.5 6.5h17v12h-17z" />
          <path d="m4 7 8 6 8-6" />
        </>
      );
    default:
      return assertNever(kind);
  }
}

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

interface NavItem {
  label: string;
  href?: string;
  target?: '_blank';
  rel?: 'noopener';
}

const NAV_ITEMS: readonly NavItem[] = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/matthijn-dijkstra-65527199/',
    target: '_blank',
    rel: 'noopener',
  },
  { label: 'Resume', href: '/resume.pdf' },
  { label: 'Contact', href: "mailto:hire@mdijkstra.dev?subject=Let's%20build%20something" },
];

function NavEntry({ item }: { item: NavItem }) {
  if (!item.href) return <span className={styles.link}>{item.label}</span>;

  return (
    <a className={styles.link} href={item.href} target={item.target} rel={item.rel}>
      {item.label}
    </a>
  );
}

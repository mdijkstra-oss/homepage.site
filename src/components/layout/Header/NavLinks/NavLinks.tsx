import { type NavItem, SITE } from '../../../../content/site';
import styles from './NavLinks.module.css';

export default function NavLinks() {
  return (
    <div className={styles.links}>
      {SITE.nav.map((item) => (
        <NavEntry key={item.label} item={item} />
      ))}
    </div>
  );
}

function NavEntry({ item }: { item: NavItem }) {
  if (!item.href) return <span className={styles.link}>{item.label}</span>;

  return (
    <a className={styles.link} href={item.href} target={item.target} rel={item.rel}>
      {item.label}
    </a>
  );
}

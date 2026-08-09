import { useEffect, useId, useRef, useState } from 'react';
import { type NavItem, SITE } from '../../../../content/site';
import styles from './NavLinks.module.css';

export default function NavLinks() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuId = useId();

  useEffect(
    function dismissMenu() {
      if (!isMenuOpen) return;

      function onPointerDown(event: PointerEvent) {
        if (!navRef.current?.contains(event.target as Node)) setIsMenuOpen(false);
      }

      function onKeyDown(event: KeyboardEvent) {
        if (event.key === 'Escape') setIsMenuOpen(false);
      }

      window.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('keydown', onKeyDown);

      return function unbindDismissMenu() {
        window.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('keydown', onKeyDown);
      };
    },
    [isMenuOpen],
  );

  return (
    <nav ref={navRef} className={styles.nav}>
      <button
        type="button"
        className={styles.toggle}
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isMenuOpen}
        aria-controls={menuId}
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <span aria-hidden="true" className={styles.bars} />
      </button>

      <div id={menuId} className={styles.links} data-open={isMenuOpen ? '' : undefined}>
        {SITE.nav.map((item) => (
          <NavEntry key={item.label} item={item} onNavigate={() => setIsMenuOpen(false)} />
        ))}
      </div>
    </nav>
  );
}

function NavEntry({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  if (!item.href) return <span className={styles.link}>{item.label}</span>;

  return (
    <a className={styles.link} href={item.href} target={item.target} rel={item.rel} onClick={onNavigate}>
      {item.label}
    </a>
  );
}

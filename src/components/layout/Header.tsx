import Logo from './Logo';
import NavLinks from './NavLinks';
import styles from './Header.module.css';

export default function Header() {
  return (
    <div data-chrome="" className={styles.header}>
      <Logo />
      <NavLinks />
    </div>
  );
}

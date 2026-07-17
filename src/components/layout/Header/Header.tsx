import styles from './Header.module.css';
import Logo from './Logo/Logo';
import NavLinks from './NavLinks/NavLinks';

export default function Header() {
  return (
    <div data-fly-away="" className={styles.header}>
      <Logo />
      <NavLinks />
    </div>
  );
}

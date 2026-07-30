import { SITE } from '../../../../content/site';
import styles from './Logo.module.css';

export default function Logo() {
  return (
    <a className={styles.logo} href="/">
      <span aria-hidden="true" className={styles.grid}>
        <span className={styles.off} />
        <span className={styles.cell1} />
        <span className={styles.off} />
        <span className={styles.off} />
        <span className={styles.off} />
        <span className={styles.cell2} />
        <span className={styles.cell3} />
        <span className={styles.cell4} />
        <span className={styles.cell5} />
      </span>
      {SITE.logo}
    </a>
  );
}

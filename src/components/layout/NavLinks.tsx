import styles from './NavLinks.module.css';

export default function NavLinks() {
  return (
    <div className={styles.links}>
      <a className={styles.link} href="https://www.linkedin.com/in/matthijn-dijkstra-65527199/" target="_blank" rel="noopener">LinkedIn</a>
      <span className={styles.link}>Resume</span>
      <a className={styles.link} href="mailto:hire@mdijkstra.dev?subject=Let's%20build%20something">Contact</a>
    </div>
  );
}

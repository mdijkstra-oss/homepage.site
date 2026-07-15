import styles from './Background.module.css';

export function GameCanvases() {
  return (
    <>
      <canvas data-gol="" className={styles.golCanvas} />
      <canvas data-burst="" className={styles.burstCanvas} />
    </>
  );
}

export function Aurora() {
  return <div className={styles.aurora} />;
}

export function Grid() {
  return <div className={styles.grid} />;
}

export function Vignette() {
  return <div className={styles.vignette} />;
}

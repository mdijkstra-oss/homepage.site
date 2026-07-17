import styles from './CardHeading.module.css';

interface CardHeadingProps {
  title: string;
  subtitle?: string;
}

export function CardHeading({ title, subtitle }: CardHeadingProps) {
  return (
    <>
      <div className={styles.title}>{title}</div>
      {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
    </>
  );
}

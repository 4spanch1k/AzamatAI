import type { PropsWithChildren } from 'react';
import styles from './ResultSection.module.css';

interface ResultSectionProps {
  title: string;
  eyebrow?: string;
}

export function ResultSection({
  title,
  eyebrow,
  children,
}: PropsWithChildren<ResultSectionProps>) {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
        <h3>{title}</h3>
      </header>
      <div className={styles.content}>{children}</div>
    </section>
  );
}

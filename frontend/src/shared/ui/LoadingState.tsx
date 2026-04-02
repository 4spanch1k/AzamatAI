import styles from './Feedback.module.css';

interface LoadingStateProps {
  title: string;
  message: string;
  eyebrow?: string;
  fullPage?: boolean;
}

export function LoadingState({ title, message, eyebrow, fullPage = false }: LoadingStateProps) {
  return (
    <div className={fullPage ? styles.centered : undefined}>
      <section aria-live="polite" className={styles.state} role="status">
        {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
        <span className={styles.indicator} aria-hidden="true" />
        <h3>{title}</h3>
        <p>{message}</p>
      </section>
    </div>
  );
}

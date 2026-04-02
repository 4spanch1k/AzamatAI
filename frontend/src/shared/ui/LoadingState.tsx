import styles from './Feedback.module.css';

interface LoadingStateProps {
  title: string;
  message: string;
  fullPage?: boolean;
}

export function LoadingState({ title, message, fullPage = false }: LoadingStateProps) {
  return (
    <div className={fullPage ? styles.centered : undefined}>
      <section className={styles.state}>
        <span className={styles.indicator} aria-hidden="true" />
        <h3>{title}</h3>
        <p>{message}</p>
      </section>
    </div>
  );
}

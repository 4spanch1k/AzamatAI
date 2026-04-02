import styles from './Feedback.module.css';

interface EmptyStateProps {
  title: string;
  message: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <section className={styles.state}>
      <h3>{title}</h3>
      <p>{message}</p>
    </section>
  );
}

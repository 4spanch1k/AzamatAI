import styles from './Feedback.module.css';

interface EmptyStateProps {
  title: string;
  message: string;
  eyebrow?: string;
  items?: string[];
}

export function EmptyState({ title, message, eyebrow, items }: EmptyStateProps) {
  return (
    <section className={styles.state}>
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      <h3>{title}</h3>
      <p>{message}</p>
      {items && items.length > 0 && (
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item} className={styles.listItem}>
              <span className={styles.listMarker}>+</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

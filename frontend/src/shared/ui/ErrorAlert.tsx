import styles from './Feedback.module.css';

interface ErrorAlertProps {
  title?: string;
  message: string;
}

export function ErrorAlert({ title = 'Something went wrong', message }: ErrorAlertProps) {
  return (
    <section className={styles.alert} role="alert">
      <strong>{title}</strong>
      <p>{message}</p>
    </section>
  );
}

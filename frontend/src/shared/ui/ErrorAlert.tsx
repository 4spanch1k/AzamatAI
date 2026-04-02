import { Button } from './Button';
import styles from './Feedback.module.css';
import { useLanguage } from '@/shared/i18n/LanguageProvider';

interface ErrorAlertProps {
  title?: string;
  message: string;
  hint?: string;
  actionLabel?: string;
  onAction?: () => void;
  disabled?: boolean;
}

export function ErrorAlert({
  title = 'Something went wrong',
  message,
  hint,
  actionLabel,
  onAction,
  disabled = false,
}: ErrorAlertProps) {
  const { language } = useLanguage();
  const resolvedTitle =
    title === 'Something went wrong'
      ? language === 'kz'
        ? 'Бір нәрсе қате кетті'
        : 'Что-то пошло не так'
      : title;

  return (
    <section className={styles.alert} role="alert">
      <strong>{resolvedTitle}</strong>
      <p>{message}</p>
      {hint && <p className={styles.alertHint}>{hint}</p>}
      {actionLabel && onAction && (
        <div className={styles.alertActions}>
          <Button disabled={disabled} onClick={onAction} type="button" variant="secondary">
            {actionLabel}
          </Button>
        </div>
      )}
    </section>
  );
}

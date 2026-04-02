import styles from './Feedback.module.css';
import { useLanguage } from '@/shared/i18n/LanguageProvider';

interface ErrorAlertProps {
  title?: string;
  message: string;
}

export function ErrorAlert({ title = 'Something went wrong', message }: ErrorAlertProps) {
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
    </section>
  );
}

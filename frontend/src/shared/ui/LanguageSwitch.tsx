import { useLanguage } from '@/shared/i18n/LanguageProvider';
import styles from './LanguageSwitch.module.css';

interface LanguageSwitchProps {
  className?: string;
}

export function LanguageSwitch({ className = '' }: LanguageSwitchProps) {
  const { language, setLanguage, messages } = useLanguage();

  return (
    <div
      aria-label={messages.common.languageSwitch}
      className={`${styles.switch} ${className}`.trim()}
      role="group"
    >
      {(['ru', 'kz'] as const).map((item) => (
        <button
          key={item}
          aria-pressed={language === item}
          className={`${styles.button} ${language === item ? styles.buttonActive : ''}`}
          onClick={() => setLanguage(item)}
          type="button"
        >
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

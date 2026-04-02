import { Link } from 'react-router';
import { useLanguage } from '@/shared/i18n/LanguageProvider';
import styles from './AppLogo.module.css';

interface AppLogoProps {
  to?: string;
  compact?: boolean;
  subtitle?: string;
}

export function AppLogo({
  to = '/',
  compact = false,
  subtitle,
}: AppLogoProps) {
  const { messages } = useLanguage();
  const resolvedSubtitle = subtitle ?? messages.appLogoSubtitle;

  const content = (
    <>
      <span className={styles.mark}>A</span>
      <span className={styles.copy}>
        <strong>AzamatAI</strong>
        {!compact && <small>{resolvedSubtitle}</small>}
      </span>
    </>
  );

  return (
    <Link className={styles.logo} to={to} aria-label="AzamatAI home">
      {content}
    </Link>
  );
}

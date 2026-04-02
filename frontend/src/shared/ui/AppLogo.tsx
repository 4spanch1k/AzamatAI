import { Link } from 'react-router';
import styles from './AppLogo.module.css';

interface AppLogoProps {
  to?: string;
  compact?: boolean;
  subtitle?: string;
}

export function AppLogo({
  to = '/',
  compact = false,
  subtitle = 'AI guidance for Kazakhstan',
}: AppLogoProps) {
  const content = (
    <>
      <span className={styles.mark}>A</span>
      <span className={styles.copy}>
        <strong>AzamatAI</strong>
        {!compact && <small>{subtitle}</small>}
      </span>
    </>
  );

  return (
    <Link className={styles.logo} to={to} aria-label="AzamatAI home">
      {content}
    </Link>
  );
}

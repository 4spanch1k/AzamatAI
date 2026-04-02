import { Menu } from 'lucide-react';
import { useAuth } from '@/features/auth/model/AuthContext';
import { useLanguage } from '@/shared/i18n/LanguageProvider';
import { getDashboardRouteTitle } from '@/shared/lib/dashboardRouteTitle';
import { LanguageSwitch } from '@/shared/ui/LanguageSwitch';
import styles from './TopBar.module.css';

interface TopBarProps {
  currentPath: string;
  onMenuClick?: () => void;
}

export function TopBar({ currentPath, onMenuClick }: TopBarProps) {
  const { user } = useAuth();
  const { messages } = useLanguage();

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <button
          aria-label={messages.common.openNavigation}
          className={styles.menuButton}
          onClick={onMenuClick}
          type="button"
        >
          <Menu size={18} />
        </button>
        <h1 className={styles.title}>{messages.navigation[getDashboardRouteTitle(currentPath)]}</h1>
      </div>

      <div className={styles.right}>
        <LanguageSwitch className={styles.languageSwitch} />

        <div className={styles.avatar} aria-label={messages.common.userAvatar}>
          {user?.name?.slice(0, 1) ?? 'A'}
        </div>
      </div>
    </header>
  );
}

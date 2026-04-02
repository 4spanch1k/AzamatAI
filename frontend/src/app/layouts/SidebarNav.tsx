import { NavLink } from 'react-router';
import { navigationItems } from '@/shared/config/navigation';
import { useLanguage } from '@/shared/i18n/LanguageProvider';
import { AppLogo } from '@/shared/ui/AppLogo';
import styles from './SidebarNav.module.css';

interface SidebarNavProps {
  onNavigate?: () => void;
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const { messages } = useLanguage();

  return (
    <div className={styles.sidebar}>
      <div className={styles.brand}>
        <AppLogo to="/dashboard" />
      </div>

      <nav className={styles.navigation} aria-label={messages.common.dashboardNavigation}>
        {navigationItems.map(({ route, key, icon: Icon }) => (
          <NavLink
            key={route}
            to={route}
            end={route === '/dashboard'}
            className={({ isActive }) => `${styles.item} ${isActive ? styles.itemActive : ''}`}
            onClick={onNavigate}
          >
            <span className={styles.icon}>
              <Icon size={18} />
            </span>
            <span className={styles.label}>{messages.navigation[key]}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

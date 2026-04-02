import { NavLink } from 'react-router';
import { navigationItems } from '@/shared/config/navigation';
import { AppLogo } from '@/shared/ui/AppLogo';
import styles from './SidebarNav.module.css';

interface SidebarNavProps {
  onNavigate?: () => void;
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  return (
    <div className={styles.sidebar}>
      <div className={styles.brand}>
        <AppLogo subtitle="Product workspace" to="/dashboard" />
      </div>

      <nav className={styles.navigation} aria-label="Dashboard navigation">
        {navigationItems.map(({ route, label, icon: Icon }) => (
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
            <span className={styles.label}>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

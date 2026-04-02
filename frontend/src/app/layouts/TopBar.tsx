import { useState } from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '@/features/auth/model/AuthContext';
import styles from './TopBar.module.css';

const routeTitleMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/document-decoder': 'Document Decoder',
  '/dashboard/egov-navigator': 'eGov Navigator',
  '/dashboard/loan-analyzer': 'Loan Analyzer',
  '/dashboard/job-offer-scanner': 'Job Offer Scanner',
};

interface TopBarProps {
  currentPath: string;
  onMenuClick?: () => void;
}

export function getDashboardRouteTitle(pathname: string) {
  return routeTitleMap[pathname] ?? 'Dashboard';
}

export function TopBar({ currentPath, onMenuClick }: TopBarProps) {
  const { user } = useAuth();
  const [language, setLanguage] = useState<'RU' | 'KZ'>('RU');

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <button className={styles.menuButton} onClick={onMenuClick} type="button" aria-label="Open navigation">
          <Menu size={18} />
        </button>
        <h1 className={styles.title}>{getDashboardRouteTitle(currentPath)}</h1>
      </div>

      <div className={styles.right}>
        <div className={styles.languageSwitch} aria-label="Language switch placeholder">
          {(['RU', 'KZ'] as const).map((item) => (
            <button
              key={item}
              className={`${styles.languageButton} ${language === item ? styles.languageButtonActive : ''}`}
              onClick={() => setLanguage(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>

        <div className={styles.avatar} aria-label="User avatar placeholder">
          {user?.name?.slice(0, 1) ?? 'A'}
        </div>
      </div>
    </header>
  );
}

import { useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '@/features/auth/model/AuthContext';
import { SidebarNav } from './SidebarNav';
import { TopBar } from './TopBar';
import styles from './DashboardLayout.module.css';

export function DashboardLayout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.desktopSidebar}>
        <SidebarNav />
      </aside>

      {sidebarOpen && (
        <div className={styles.mobileOverlay} onClick={() => setSidebarOpen(false)} role="presentation">
          <aside className={styles.mobileSidebar} onClick={(event) => event.stopPropagation()}>
            <SidebarNav onNavigate={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      <div className={styles.main}>
        <TopBar currentPath={location.pathname} onMenuClick={() => setSidebarOpen(true)} />

        <main className={styles.workspace}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

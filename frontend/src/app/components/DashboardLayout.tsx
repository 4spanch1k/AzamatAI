import { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Globe,
  TrendingUp,
  Briefcase,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: FileText, label: 'Document Decoder', href: '/dashboard/document' },
  { icon: Globe, label: 'eGov Navigator', href: '/dashboard/egov' },
  { icon: TrendingUp, label: 'Loan Analyzer', href: '/dashboard/loan' },
  { icon: Briefcase, label: 'Job Offer Scanner', href: '/dashboard/job' },
];

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [langActive, setLangActive] = useState<'RU' | 'KZ'>('RU');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(href);
  };

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside
      className={`${
        mobile
          ? 'w-full h-full'
          : 'w-60 h-screen sticky top-0 hidden lg:flex flex-col'
      } bg-white border-r border-border flex flex-col`}
    >
      {/* Logo */}
      <div className="px-5 py-5 flex items-center justify-between border-b border-border">
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white select-none">A</span>
          </div>
          <div>
            <p className="text-foreground text-sm leading-tight">AzamatAI</p>
            <p className="text-muted-foreground" style={{ fontSize: '11px' }}>Legal & Financial Co-Pilot</p>
          </div>
        </Link>
        {mobile && (
          <button onClick={() => setSidebarOpen(false)} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-xs text-muted-foreground px-3 py-2 uppercase tracking-wider">Navigation</p>
        {navItems.map(({ icon: Icon, label, href }) => {
          const active = isActive(href);
          return (
            <button
              key={href}
              onClick={() => {
                navigate(href);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                active
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-72 z-10">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-border px-6 py-3.5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              className="lg:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            {/* Breadcrumb / page title */}
            <span className="text-sm text-muted-foreground hidden sm:block">
              {navItems.find((n) => isActive(n.href))?.label ?? 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              {(['RU', 'KZ'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLangActive(lang)}
                  className={`px-2.5 py-1 rounded text-xs transition-all ${
                    langActive === lang
                      ? 'bg-white text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* User avatar */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 hover:bg-muted rounded-lg px-2 py-1.5 transition-colors"
              >
                <div className="w-7 h-7 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs select-none">
                  {user?.name?.charAt(0).toUpperCase() ?? 'U'}
                </div>
                <span className="text-sm text-foreground hidden sm:block max-w-[120px] truncate">
                  {user?.email ?? 'User'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-border rounded-xl shadow-lg z-20 py-1.5">
                    <div className="px-3 py-2 border-b border-border mb-1">
                      <p className="text-xs text-muted-foreground">Signed in as</p>
                      <p className="text-sm text-foreground truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

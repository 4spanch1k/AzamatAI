import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

const STORAGE_KEY = 'azamatai.session';

export interface AuthUser {
  email: string;
  name: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function persistUser(user: AuthUser | null) {
  if (typeof window === 'undefined') {
    return;
  }

  if (user) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}

function buildUser(email: string): AuthUser {
  const [namePart] = email.split('@');
  const normalizedName = namePart
    .split(/[._-]/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');

  return {
    email,
    name: normalizedName || 'AzamatAI User',
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());

  const login = useCallback(async (email: string, _password: string) => {
    await new Promise((resolve) => window.setTimeout(resolve, 700));
    const nextUser = buildUser(email);
    persistUser(nextUser);
    setUser(nextUser);
  }, []);

  const register = useCallback(async (email: string, _password: string) => {
    await new Promise((resolve) => window.setTimeout(resolve, 850));
    const nextUser = buildUser(email);
    persistUser(nextUser);
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    persistUser(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
    }),
    [login, logout, register, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}

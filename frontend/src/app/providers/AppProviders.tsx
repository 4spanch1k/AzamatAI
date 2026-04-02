import type { ReactNode } from 'react';
import { AuthProvider } from '@/features/auth/model/AuthContext';
import { LanguageProvider } from '@/shared/i18n/LanguageProvider';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <LanguageProvider>
      <AuthProvider>{children}</AuthProvider>
    </LanguageProvider>
  );
}

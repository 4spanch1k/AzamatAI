import { Suspense } from 'react';
import { RouterProvider } from 'react-router';
import { AppProviders } from './providers/AppProviders';
import { router } from './router/router';
import { useLanguage } from '@/shared/i18n/LanguageProvider';
import { LoadingState } from '@/shared/ui/LoadingState';

function AppRouter() {
  const { messages } = useLanguage();

  return (
    <Suspense
      fallback={
        <LoadingState
          fullPage
          message={messages.common.loadingMessage}
          title={messages.common.loadingTitle}
        />
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}

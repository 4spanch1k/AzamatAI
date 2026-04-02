import { Suspense } from 'react';
import { RouterProvider } from 'react-router';
import { AppProviders } from './providers/AppProviders';
import { router } from './router/router';
import { LoadingState } from '@/shared/ui/LoadingState';

export default function App() {
  return (
    <AppProviders>
      <Suspense fallback={<LoadingState title="Loading workspace" message="Preparing the next screen." fullPage />}>
        <RouterProvider router={router} />
      </Suspense>
    </AppProviders>
  );
}

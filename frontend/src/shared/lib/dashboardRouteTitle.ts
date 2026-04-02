import type { NavigationKey } from '@/shared/config/navigation';

export const dashboardRouteTitleMap: Record<string, NavigationKey> = {
  '/dashboard': 'dashboard',
  '/dashboard/document-decoder': 'document-decoder',
  '/dashboard/egov-navigator': 'egov-navigator',
  '/dashboard/loan-analyzer': 'loan-analyzer',
  '/dashboard/job-offer-scanner': 'job-offer-scanner',
};

export function getDashboardRouteTitle(pathname: string): NavigationKey {
  return dashboardRouteTitleMap[pathname] ?? 'dashboard';
}

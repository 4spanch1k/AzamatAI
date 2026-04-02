import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import { AuthLayout } from '@/app/layouts/AuthLayout';

const WelcomePage = lazy(() => import('@/pages/WelcomePage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const DocumentDecoderPage = lazy(() => import('@/pages/DocumentDecoderPage'));
const EGovNavigatorPage = lazy(() => import('@/pages/EGovNavigatorPage'));
const LoanAnalyzerPage = lazy(() => import('@/pages/LoanAnalyzerPage'));
const JobOfferScannerPage = lazy(() => import('@/pages/JobOfferScannerPage'));

export const router = createBrowserRouter([
  {
    index: true,
    Component: WelcomePage,
  },
  {
    Component: AuthLayout,
    children: [
      {
        path: 'login',
        Component: LoginPage,
      },
      {
        path: 'register',
        Component: RegisterPage,
      },
    ],
  },
  {
    path: 'dashboard',
    Component: DashboardLayout,
    children: [
      {
        index: true,
        Component: DashboardPage,
      },
      {
        path: 'document-decoder',
        Component: DocumentDecoderPage,
      },
      {
        path: 'egov-navigator',
        Component: EGovNavigatorPage,
      },
      {
        path: 'loan-analyzer',
        Component: LoanAnalyzerPage,
      },
      {
        path: 'job-offer-scanner',
        Component: JobOfferScannerPage,
      },
      {
        path: 'document',
        Component: () => <Navigate to="/dashboard/document-decoder" replace />,
      },
      {
        path: 'egov',
        Component: () => <Navigate to="/dashboard/egov-navigator" replace />,
      },
      {
        path: 'loan',
        Component: () => <Navigate to="/dashboard/loan-analyzer" replace />,
      },
      {
        path: 'job',
        Component: () => <Navigate to="/dashboard/job-offer-scanner" replace />,
      },
    ],
  },
  {
    path: '*',
    Component: () => <Navigate to="/" replace />,
  },
]);

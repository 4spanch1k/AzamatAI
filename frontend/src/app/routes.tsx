import { createBrowserRouter, Navigate } from 'react-router';
import { WelcomeScreen } from './components/WelcomeScreen';
import { LoginScreen } from './components/LoginScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { DashboardLayout } from './components/DashboardLayout';
import { DashboardHome } from './components/DashboardHome';
import { DocumentDecoder } from './components/DocumentDecoder';
import { EGovNavigator } from './components/EGovNavigator';
import { LoanAnalyzer } from './components/LoanAnalyzer';
import { JobOfferScanner } from './components/JobOfferScanner';
import { ModuleWrapper } from './components/ModuleWrapper';
import { FileText, Globe, TrendingUp, Briefcase } from 'lucide-react';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: WelcomeScreen,
  },
  {
    path: '/login',
    Component: LoginScreen,
  },
  {
    path: '/register',
    Component: RegisterScreen,
  },
  {
    path: '/dashboard',
    Component: DashboardLayout,
    children: [
      {
        index: true,
        Component: DashboardHome,
      },
      {
        path: 'document',
        Component: () => (
          <ModuleWrapper
            icon={FileText}
            title="Document Decoder"
            description="Paste an official document and get a plain-language summary with action steps"
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          >
            <DocumentDecoder />
          </ModuleWrapper>
        ),
      },
      {
        path: 'egov',
        Component: () => (
          <ModuleWrapper
            icon={Globe}
            title="eGov Navigator"
            description="Describe what you need to do on egov.kz and get step-by-step guidance"
            iconBg="bg-teal-100"
            iconColor="text-teal-600"
          >
            <EGovNavigator />
          </ModuleWrapper>
        ),
      },
      {
        path: 'loan',
        Component: () => (
          <ModuleWrapper
            icon={TrendingUp}
            title="Loan Analyzer"
            description="Enter loan terms and discover the true effective rate and total cost"
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
          >
            <LoanAnalyzer />
          </ModuleWrapper>
        ),
      },
      {
        path: 'job',
        Component: () => (
          <ModuleWrapper
            icon={Briefcase}
            title="Job Offer Scanner"
            description="Detect red flags in job listings before you apply or send money"
            iconBg="bg-rose-100"
            iconColor="text-rose-600"
          >
            <JobOfferScanner />
          </ModuleWrapper>
        ),
      },
    ],
  },
  {
    path: '*',
    Component: () => <Navigate to="/" replace />,
  },
]);

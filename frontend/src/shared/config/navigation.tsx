import {
  BriefcaseBusiness,
  FileText,
  Globe,
  LayoutDashboard,
  type LucideIcon,
  TrendingUp,
} from 'lucide-react';

export type ModuleTone = 'cyan' | 'teal' | 'amber' | 'rose';

export interface ModuleDefinition {
  key: 'document-decoder' | 'egov-navigator' | 'loan-analyzer' | 'job-offer-scanner';
  title: string;
  shortLabel: string;
  route: string;
  icon: LucideIcon;
  tone: ModuleTone;
  description: string;
  homeSummary: string;
}

export interface NavigationItem {
  label: string;
  route: string;
  icon: LucideIcon;
}

export const toneStyles: Record<
  ModuleTone,
  {
    solid: string;
    soft: string;
    border: string;
  }
> = {
  cyan: {
    solid: '#0ba4bf',
    soft: 'rgba(11, 164, 191, 0.12)',
    border: 'rgba(11, 164, 191, 0.2)',
  },
  teal: {
    solid: '#149b8a',
    soft: 'rgba(20, 155, 138, 0.12)',
    border: 'rgba(20, 155, 138, 0.22)',
  },
  amber: {
    solid: '#d0881f',
    soft: 'rgba(208, 136, 31, 0.14)',
    border: 'rgba(208, 136, 31, 0.24)',
  },
  rose: {
    solid: '#db5f70',
    soft: 'rgba(219, 95, 112, 0.13)',
    border: 'rgba(219, 95, 112, 0.2)',
  },
};

export const modules: ModuleDefinition[] = [
  {
    key: 'document-decoder',
    title: 'Document Decoder',
    shortLabel: 'Document Decoder',
    route: '/dashboard/document-decoder',
    icon: FileText,
    tone: 'cyan',
    description: 'Break down official letters, notices, and documents into plain-language next steps.',
    homeSummary: 'Summarize official documents and surface deadlines, risks, and concrete actions.',
  },
  {
    key: 'egov-navigator',
    title: 'eGov Navigator',
    shortLabel: 'eGov Navigator',
    route: '/dashboard/egov-navigator',
    icon: Globe,
    tone: 'teal',
    description: 'Turn a government task into a simple route through egov.kz and required paperwork.',
    homeSummary: 'Explain what to prepare, where to apply, and how to finish each public service flow.',
  },
  {
    key: 'loan-analyzer',
    title: 'Loan Analyzer',
    shortLabel: 'Loan Analyzer',
    route: '/dashboard/loan-analyzer',
    icon: TrendingUp,
    tone: 'amber',
    description: 'Estimate the true cost of a loan, spot fee pressure, and frame a practical recommendation.',
    homeSummary: 'Compare total payment, overpayment, and warning signals before you accept the offer.',
  },
  {
    key: 'job-offer-scanner',
    title: 'Job Offer Scanner',
    shortLabel: 'Job Offer Scanner',
    route: '/dashboard/job-offer-scanner',
    icon: BriefcaseBusiness,
    tone: 'rose',
    description: 'Check job descriptions for scam patterns, vague terms, and risky payment requests.',
    homeSummary: 'Highlight red flags, assign a risk score, and explain how to respond safely.',
  },
];

export const navigationItems: NavigationItem[] = [
  {
    label: 'Dashboard',
    route: '/dashboard',
    icon: LayoutDashboard,
  },
  ...modules.map(({ shortLabel, route, icon }) => ({
    label: shortLabel,
    route,
    icon,
  })),
];

export function getModuleByRoute(route: string) {
  return modules.find((module) => route.startsWith(module.route));
}

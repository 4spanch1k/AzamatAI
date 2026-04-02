import {
  BriefcaseBusiness,
  FileText,
  Globe,
  LayoutDashboard,
  type LucideIcon,
  TrendingUp,
} from 'lucide-react';

export type ModuleTone = 'cyan' | 'teal' | 'amber' | 'rose';
export type ModuleKey =
  | 'document-decoder'
  | 'egov-navigator'
  | 'loan-analyzer'
  | 'job-offer-scanner';
export type NavigationKey = 'dashboard' | ModuleKey;

export interface ModuleDefinition {
  key: ModuleKey;
  route: string;
  icon: LucideIcon;
  tone: ModuleTone;
}

export interface NavigationItem {
  key: NavigationKey;
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
    route: '/dashboard/document-decoder',
    icon: FileText,
    tone: 'cyan',
  },
  {
    key: 'egov-navigator',
    route: '/dashboard/egov-navigator',
    icon: Globe,
    tone: 'teal',
  },
  {
    key: 'loan-analyzer',
    route: '/dashboard/loan-analyzer',
    icon: TrendingUp,
    tone: 'amber',
  },
  {
    key: 'job-offer-scanner',
    route: '/dashboard/job-offer-scanner',
    icon: BriefcaseBusiness,
    tone: 'rose',
  },
];

export const navigationItems: NavigationItem[] = [
  {
    key: 'dashboard',
    route: '/dashboard',
    icon: LayoutDashboard,
  },
  ...modules.map(({ key, route, icon }) => ({
    key,
    route,
    icon,
  })),
];

export function getModuleByRoute(route: string) {
  return modules.find((module) => route.startsWith(module.route));
}

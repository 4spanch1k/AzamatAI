import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  Globe,
  TrendingUp,
  Briefcase,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';

const modules = [
  {
    icon: FileText,
    label: 'Document Decoder',
    color: 'bg-blue-50 text-blue-600',
    iconBg: 'bg-blue-100',
    desc: 'Paste any official document — tax notice, court letter, government act — and get a plain-language summary with clear action steps.',
    href: '/dashboard/document',
    badge: 'Most used',
  },
  {
    icon: Globe,
    label: 'eGov Navigator',
    color: 'bg-teal-50 text-teal-600',
    iconBg: 'bg-teal-100',
    desc: 'Describe what you need to do — open a business, pay taxes, get a certificate — and get a step-by-step guide on egov.kz.',
    href: '/dashboard/egov',
    badge: null,
  },
  {
    icon: TrendingUp,
    label: 'Loan Analyzer',
    color: 'bg-amber-50 text-amber-600',
    iconBg: 'bg-amber-100',
    desc: 'Enter loan terms and see the true effective interest rate, total cost, and whether the offer is fair compared to market averages.',
    href: '/dashboard/loan',
    badge: null,
  },
  {
    icon: Briefcase,
    label: 'Job Offer Scanner',
    color: 'bg-rose-50 text-rose-600',
    iconBg: 'bg-rose-100',
    desc: 'Paste a job listing from hh.kz or Telegram and detect red flags: upfront fees, unrealistic salaries, and unverified companies.',
    href: '/dashboard/job',
    badge: 'New',
  },
];

const recentActivity = [
  { icon: FileText, label: 'Tax Notice analyzed', time: '2 hours ago', status: 'Medium Priority' },
  { icon: Globe, label: 'IP Registration guide', time: 'Yesterday', status: 'Completed' },
  { icon: TrendingUp, label: 'Loan: ₸1,000,000 / 24 mo', time: '3 days ago', status: 'High Risk' },
];

export function DashboardHome() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const firstName = user?.name
    ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
    : 'there';

  return (
    <div className="p-8 max-w-5xl">
      {/* Greeting */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="text-sm text-primary">AI Co-Pilot Ready</span>
        </div>
        <h1 className="text-2xl text-foreground mb-2">Welcome back, {firstName}!</h1>
        <p className="text-muted-foreground">
          Choose a tool below to analyze documents, navigate government services, evaluate loans, or scan job offers.
        </p>
      </div>

      {/* Module cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {modules.map(({ icon: Icon, label, color, iconBg, desc, href, badge }) => (
          <div
            key={label}
            className="bg-white border border-border rounded-xl p-6 flex flex-col gap-4 hover:border-primary/30 hover:shadow-sm transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color.split(' ')[1]}`} />
              </div>
              {badge && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${color}`}>{badge}</span>
              )}
            </div>
            <div>
              <h3 className="text-foreground mb-1.5">{label}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
            <button
              onClick={() => navigate(href)}
              className="mt-auto flex items-center gap-1.5 text-sm text-primary hover:gap-2.5 transition-all"
            >
              Open tool
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-foreground">Recent Activity</h2>
        </div>
        <div className="bg-white border border-border rounded-xl divide-y divide-border">
          {recentActivity.map(({ icon: Icon, label, time, status }) => (
            <div key={label} className="flex items-center gap-4 px-5 py-3.5">
              <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{label}</p>
                <p className="text-xs text-muted-foreground">{time}</p>
              </div>
              <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full flex-shrink-0">
                {status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick demo */}
      <div className="mt-6 bg-primary/5 border border-primary/20 rounded-xl p-5 flex items-center gap-4">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-foreground mb-0.5">Try the live demo</p>
          <p className="text-xs text-muted-foreground">Each tool has pre-filled demo data — just click "Try Demo" inside any module.</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/document')}
          className="text-sm text-primary hover:underline flex-shrink-0"
        >
          Start →
        </button>
      </div>
    </div>
  );
}

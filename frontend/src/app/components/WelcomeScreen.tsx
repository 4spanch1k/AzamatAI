import { useNavigate } from 'react-router';
import { FileText, Globe, TrendingUp, Briefcase, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: FileText,
    label: 'Document Decoder',
    desc: 'Understand any official document instantly',
  },
  {
    icon: Globe,
    label: 'eGov Navigator',
    desc: 'Step-by-step government service guides',
  },
  {
    icon: TrendingUp,
    label: 'Loan Analyzer',
    desc: 'See the real cost of any loan offer',
  },
  {
    icon: Briefcase,
    label: 'Job Scanner',
    desc: 'Detect scam offers before it's too late',
  },
];

export function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal top bar */}
      <header className="px-8 py-5 flex items-center justify-between border-b border-border bg-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white text-lg select-none">A</span>
          </div>
          <span className="text-foreground text-lg">AzamatAI</span>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Sign In
        </button>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm mb-8">
          <ShieldCheck className="w-4 h-4" />
          <span>Trusted AI for Kazakhstan</span>
        </div>

        <h1 className="text-4xl text-foreground mb-4 max-w-2xl leading-tight">
          Your Legal &amp; Financial<br />AI Co-Pilot
        </h1>

        <p className="text-muted-foreground text-lg max-w-lg mb-10 leading-relaxed">
          Understand documents, loans, bureaucracy, and job offers in simple language — no legal background needed.
        </p>

        <div className="flex items-center gap-4 mb-16">
          <button
            onClick={() => navigate('/register')}
            className="px-7 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Get Started — it's free
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-7 py-3 bg-white border border-border text-foreground rounded-lg hover:border-primary/50 transition-colors"
          >
            Sign In
          </button>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl w-full">
          {features.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="bg-white border border-border rounded-xl p-5 text-left hover:border-primary/30 hover:shadow-sm transition-all"
            >
              <div className="w-9 h-9 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-3">
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-foreground text-sm mb-1">{label}</p>
              <p className="text-muted-foreground text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-border bg-white">
        © 2026 AzamatAI · Built for Kazakhstan
      </footer>
    </div>
  );
}

import { useNavigate } from 'react-router';
import { BriefcaseBusiness, FileText, Globe, ShieldCheck, TrendingUp } from 'lucide-react';
import styles from './WelcomeView.module.css';

const features = [
  {
    icon: FileText,
    title: 'Document Decoder',
    description: 'Understand any official document instantly',
  },
  {
    icon: Globe,
    title: 'eGov Navigator',
    description: 'Step-by-step government service guides',
  },
  {
    icon: TrendingUp,
    title: 'Loan Analyzer',
    description: 'See the real cost of any loan offer',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Job Offer Scanner',
    description: "Detect scam offers before it's too late",
  },
];

export function WelcomeView() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.brand} onClick={() => navigate('/')} type="button">
          <span className={styles.brandMark}>A</span>
          <span className={styles.brandLabel}>AzamatAI</span>
        </button>

        <button className={styles.headerAction} onClick={() => navigate('/login')} type="button">
          Sign In
        </button>
      </header>

      <main className={styles.hero}>
        <div className={styles.badge}>
          <ShieldCheck size={16} />
          <span>Trusted AI for Kazakhstan</span>
        </div>

        <div className={styles.copy}>
          <h1>
            Your Legal &amp; Financial
            <br />
            AI Co-Pilot
          </h1>
          <p>
            Understand documents, loans, bureaucracy, and job offers in simple language without a
            legal background.
          </p>
        </div>

        <div className={styles.actions}>
          <button className={styles.primaryAction} onClick={() => navigate('/register')} type="button">
            Get Started - it's free
          </button>
          <button className={styles.secondaryAction} onClick={() => navigate('/login')} type="button">
            Sign In
          </button>
        </div>

        <section className={styles.features} aria-label="Product features">
          {features.map((feature) => (
            <article key={feature.title} className={styles.featureCard}>
              <span className={styles.featureIcon}>
                <feature.icon size={18} />
              </span>
              <div className={styles.featureBody}>
                <h2>{feature.title}</h2>
                <p>{feature.description}</p>
              </div>
            </article>
          ))}
        </section>
      </main>

      <footer className={styles.footer}>© 2026 AzamatAI · Built for Kazakhstan</footer>
    </div>
  );
}

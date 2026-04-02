import { useNavigate } from 'react-router';
import { BriefcaseBusiness, FileText, Globe, ShieldCheck, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/shared/i18n/LanguageProvider';
import { LanguageSwitch } from '@/shared/ui/LanguageSwitch';
import styles from './WelcomeView.module.css';

const features = [
  {
    icon: FileText,
    key: 'document-decoder',
  },
  {
    icon: Globe,
    key: 'egov-navigator',
  },
  {
    icon: TrendingUp,
    key: 'loan-analyzer',
  },
  {
    icon: BriefcaseBusiness,
    key: 'job-offer-scanner',
  },
];

export function WelcomeView() {
  const navigate = useNavigate();
  const { messages } = useLanguage();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.brand} onClick={() => navigate('/')} type="button">
          <span className={styles.brandMark}>A</span>
          <span className={styles.brandLabel}>AzamatAI</span>
        </button>

        <div className={styles.headerControls}>
          <LanguageSwitch />
          <button className={styles.headerAction} onClick={() => navigate('/login')} type="button">
            {messages.welcome.topSignIn}
          </button>
        </div>
      </header>

      <main className={styles.hero}>
        <div className={styles.badge}>
          <ShieldCheck size={16} />
          <span>{messages.welcome.badge}</span>
        </div>

        <div className={styles.copy}>
          <h1>
            {messages.welcome.titleLineOne}
            <br />
            {messages.welcome.titleLineTwo}
          </h1>
          <p>{messages.welcome.description}</p>
        </div>

        <div className={styles.actions}>
          <button className={styles.primaryAction} onClick={() => navigate('/register')} type="button">
            {messages.welcome.primaryAction}
          </button>
          <button className={styles.secondaryAction} onClick={() => navigate('/login')} type="button">
            {messages.welcome.secondaryAction}
          </button>
        </div>

        <section className={styles.features} aria-label={messages.common.productFeatures}>
          {features.map((feature) => (
            <article key={feature.key} className={styles.featureCard}>
              <span className={styles.featureIcon}>
                <feature.icon size={18} />
              </span>
              <div className={styles.featureBody}>
                <h2>{messages.navigation[feature.key]}</h2>
                <p>{messages.welcome.features[feature.key]}</p>
              </div>
            </article>
          ))}
        </section>
      </main>

      <footer className={styles.footer}>{messages.welcome.footer}</footer>
    </div>
  );
}

import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, Clock3, Sparkles, Zap } from 'lucide-react';
import { useAuth } from '@/features/auth/model/AuthContext';
import { modules, toneStyles } from '@/shared/config/navigation';
import { Button } from '@/shared/ui/Button';
import { Surface } from '@/shared/ui/Surface';
import styles from './DashboardHomeView.module.css';

const recentActivity = [
  {
    title: 'Tax notice decoded',
    summary: 'Deadline flagged and payment options explained.',
    time: '2 hours ago',
  },
  {
    title: 'IP registration route built',
    summary: 'Required documents and next portal steps listed.',
    time: 'Yesterday',
  },
  {
    title: 'Loan offer benchmarked',
    summary: 'Total overpayment and fee pressure highlighted.',
    time: '3 days ago',
  },
];

export function DashboardHomeView() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.kicker}>
            <Sparkles size={16} />
            Dashboard home
          </span>
          <h1>Welcome to AzamatAI, {user?.name.split(' ')[0]}.</h1>
          <p>
            One calm workspace for legal text, public services, credit offers, and suspicious job
            listings. Start with the module that has the clearest decision pressure right now.
          </p>
        </div>

        <Surface className={styles.heroAside}>
          <strong>Quick actions</strong>
          <div className={styles.quickActions}>
            <Button fullWidth onClick={() => navigate('/dashboard/loan-analyzer')}>
              Open Loan Analyzer
            </Button>
            <Button fullWidth variant="secondary" onClick={() => navigate('/dashboard/job-offer-scanner')}>
              Run risk scan
            </Button>
          </div>
          <p>
            Demo data is available inside each module. Use it when you want to present a complete
            result flow quickly.
          </p>
        </Surface>
      </section>

      <section className={styles.section}>
        <header className={styles.sectionHeader}>
          <div>
            <span className={styles.sectionLabel}>Tools</span>
            <h2>Four modules, one language system</h2>
          </div>
        </header>

        <div className={styles.moduleGrid}>
          {modules.map((module) => {
            const tone = toneStyles[module.tone];

            return (
              <Surface
                key={module.key}
                className={styles.moduleCard}
                style={
                  {
                    '--tone-soft': tone.soft,
                    '--tone-solid': tone.solid,
                  } as CSSProperties
                }
              >
                <div className={styles.moduleIcon}>
                  <module.icon size={20} />
                </div>
                <div className={styles.moduleBody}>
                  <strong>{module.title}</strong>
                  <p>{module.description}</p>
                </div>
                <button className={styles.inlineAction} onClick={() => navigate(module.route)} type="button">
                  Open workspace
                  <ArrowRight size={16} />
                </button>
              </Surface>
            );
          })}
        </div>
      </section>

      <section className={styles.bottomGrid}>
        <Surface className={styles.activity}>
          <header className={styles.panelHeader}>
            <span className={styles.panelTitle}>
              <Clock3 size={16} />
              Recent activity
            </span>
            <small>Mock timeline</small>
          </header>

          <div className={styles.timeline}>
            {recentActivity.map((item) => (
              <article key={item.title} className={styles.timelineItem}>
                <strong>{item.title}</strong>
                <p>{item.summary}</p>
                <span>{item.time}</span>
              </article>
            ))}
          </div>
        </Surface>

        <Surface className={styles.activity}>
          <header className={styles.panelHeader}>
            <span className={styles.panelTitle}>
              <Zap size={16} />
              Product framing
            </span>
            <small>For the demo narrative</small>
          </header>

          <ul className={styles.notes}>
            <li>Explain the problem first: people receive high-stakes information in hard language.</li>
            <li>Then show the four modules as distinct decisions inside one system.</li>
            <li>Close with why Kazakhstan-specific workflows and wording matter.</li>
          </ul>
        </Surface>
      </section>
    </div>
  );
}

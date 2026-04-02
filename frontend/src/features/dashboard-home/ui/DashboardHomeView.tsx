import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, Clock3, Sparkles, Zap } from 'lucide-react';
import { useAuth } from '@/features/auth/model/AuthContext';
import { useLanguage } from '@/shared/i18n/LanguageProvider';
import { modules, toneStyles } from '@/shared/config/navigation';
import { Button } from '@/shared/ui/Button';
import { Surface } from '@/shared/ui/Surface';
import styles from './DashboardHomeView.module.css';

export function DashboardHomeView() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { messages } = useLanguage();
  const firstName = user?.name.split(' ')[0] ?? 'Azamat';

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.kicker}>
            <Sparkles size={16} />
            {messages.dashboardHome.kicker}
          </span>
          <h1>{messages.dashboardHome.title.replace('{name}', firstName)}</h1>
          <p>{messages.dashboardHome.description}</p>
        </div>

        <Surface className={styles.heroAside}>
          <strong>{messages.dashboardHome.quickActionsTitle}</strong>
          <div className={styles.quickActions}>
            <Button fullWidth onClick={() => navigate('/dashboard/loan-analyzer')}>
              {messages.dashboardHome.quickActionPrimary}
            </Button>
            <Button fullWidth variant="secondary" onClick={() => navigate('/dashboard/job-offer-scanner')}>
              {messages.dashboardHome.quickActionSecondary}
            </Button>
          </div>
          <p>{messages.dashboardHome.quickActionNote}</p>
        </Surface>
      </section>

      <section className={styles.section}>
        <header className={styles.sectionHeader}>
          <div>
            <span className={styles.sectionLabel}>{messages.dashboardHome.toolsLabel}</span>
            <h2>{messages.dashboardHome.toolsTitle}</h2>
          </div>
        </header>

        <div className={styles.moduleGrid}>
          {modules.map((module) => {
            const tone = toneStyles[module.tone];
            const moduleCopy = messages.dashboardHome.modules[module.key];

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
                  <strong>{moduleCopy.title}</strong>
                  <p>{moduleCopy.description}</p>
                </div>
                <button className={styles.inlineAction} onClick={() => navigate(module.route)} type="button">
                  {messages.dashboardHome.openWorkspace}
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
              {messages.dashboardHome.recentActivityTitle}
            </span>
            <small>{messages.dashboardHome.recentActivityMeta}</small>
          </header>

          <div className={styles.timeline}>
            {messages.dashboardHome.recentActivity.map((item) => (
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
              {messages.dashboardHome.framingTitle}
            </span>
            <small>{messages.dashboardHome.framingMeta}</small>
          </header>

          <ul className={styles.notes}>
            {messages.dashboardHome.framingNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </Surface>
      </section>
    </div>
  );
}

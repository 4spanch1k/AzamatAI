import { useNavigate } from 'react-router';
import { modules } from '@/shared/config/navigation';
import { useLanguage } from '@/shared/i18n/LanguageProvider';
import { DashboardHero } from './components/DashboardHero';
import { FeatureCard } from './components/FeatureCard';
import styles from './DashboardHomeView.module.css';

export function DashboardHomeView() {
  const navigate = useNavigate();
  const { messages } = useLanguage();
  const copy = messages.dashboardHome;

  return (
    <div className={styles.page}>
      <DashboardHero
        description={copy.description}
        primaryActionLabel={copy.primaryAction}
        title={copy.title}
        eyebrow={copy.eyebrow}
        onPrimaryAction={() => navigate('/dashboard/document-decoder')}
      />

      <section className={styles.section}>
        <header className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>{copy.toolsLabel}</span>
          <div className={styles.sectionCopy}>
            <h2>{copy.toolsTitle}</h2>
            <p>{copy.toolsDescription}</p>
          </div>
        </header>

        <div className={styles.moduleGrid}>
          {modules.map((module) => {
            const moduleCopy = copy.modules[module.key];

            return (
              <FeatureCard
                key={module.key}
                actionLabel={copy.openWorkspace}
                description={moduleCopy.description}
                icon={module.icon}
                label={moduleCopy.label}
                title={moduleCopy.title}
                tone={module.tone}
                onAction={() => navigate(module.route)}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}

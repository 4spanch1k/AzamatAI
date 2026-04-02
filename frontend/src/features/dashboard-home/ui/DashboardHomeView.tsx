import { useNavigate } from 'react-router';
import { modules } from '@/shared/config/navigation';
import { useLanguage } from '@/shared/i18n/LanguageProvider';
import { Button } from '@/shared/ui/Button';
import { Surface } from '@/shared/ui/Surface';
import { DashboardHero } from './components/DashboardHero';
import { FeatureCard } from './components/FeatureCard';
import { QuickActions } from './components/QuickActions';
import styles from './DashboardHomeView.module.css';

export function DashboardHomeView() {
  const navigate = useNavigate();
  const { messages } = useLanguage();
  const copy = messages.dashboardHome;

  return (
    <div className={styles.page}>
      <section className={styles.topGrid}>
        <DashboardHero
          description={copy.description}
          helperLabel={copy.helperLabel}
          helperText={copy.helperText}
          primaryActionLabel={copy.primaryAction}
          secondaryActionLabel={copy.secondaryAction}
          title={copy.title}
          eyebrow={copy.eyebrow}
          onPrimaryAction={() => navigate('/dashboard/document-decoder')}
          onSecondaryAction={() => navigate('/dashboard/loan-analyzer')}
        />

        <QuickActions
          description={copy.quickStartDescription}
          note={copy.quickStartNote}
          primaryActionLabel={copy.quickActions.loan}
          secondaryActionLabel={copy.quickActions.job}
          title={copy.quickStartTitle}
          label={copy.quickStartLabel}
          onPrimaryAction={() => navigate('/dashboard/loan-analyzer')}
          onSecondaryAction={() => navigate('/dashboard/job-offer-scanner')}
        />
      </section>

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

      <Surface className={styles.onboarding}>
        <div className={styles.onboardingCopy}>
          <span className={styles.onboardingLabel}>{copy.onboardingLabel}</span>
          <strong>{copy.onboardingTitle}</strong>
          <p>{copy.onboardingDescription}</p>
        </div>

        <Button variant="ghost" onClick={() => navigate('/dashboard/document-decoder')}>
          {copy.onboardingAction}
        </Button>
      </Surface>
    </div>
  );
}

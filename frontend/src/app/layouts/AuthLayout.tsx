import { Outlet } from 'react-router';
import { useLanguage } from '@/shared/i18n/LanguageProvider';
import { AppLogo } from '@/shared/ui/AppLogo';
import { LanguageSwitch } from '@/shared/ui/LanguageSwitch';
import styles from './AuthLayout.module.css';

export function AuthLayout() {
  const { messages } = useLanguage();

  return (
    <div className={styles.layout}>
      <div className={styles.backdrop} />
      <div className={styles.content}>
        <div className={styles.toolbar}>
          <LanguageSwitch />
        </div>
        <section className={styles.hero}>
          <AppLogo />
          <div className={styles.copy}>
            <span className={styles.kicker}>{messages.authLayout.kicker}</span>
            <h1>{messages.authLayout.title}</h1>
            <p>{messages.authLayout.description}</p>
          </div>
          <dl className={styles.metrics}>
            {messages.authLayout.metrics.map((metric) => (
              <div key={metric.title}>
                <dt>{metric.title}</dt>
                <dd>{metric.description}</dd>
              </div>
            ))}
          </dl>
        </section>

        <main className={styles.panel}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { Outlet } from 'react-router';
import { AppLogo } from '@/shared/ui/AppLogo';
import styles from './AuthLayout.module.css';

export function AuthLayout() {
  return (
    <div className={styles.layout}>
      <div className={styles.backdrop} />
      <div className={styles.content}>
        <section className={styles.hero}>
          <AppLogo />
          <div className={styles.copy}>
            <span className={styles.kicker}>Desktop-first legal and financial workspace</span>
            <h1>Calm AI guidance for documents, bureaucracy, credit, and risky offers.</h1>
            <p>
              AzamatAI keeps the interface quiet and the outcome practical: what this means, what to
              do next, and where the risk actually sits.
            </p>
          </div>
          <dl className={styles.metrics}>
            <div>
              <dt>4 modules</dt>
              <dd>One workspace for document, eGov, loan, and job checks.</dd>
            </div>
            <div>
              <dt>Mock-ready flow</dt>
              <dd>Demo states, guarded routes, and result UX prepared for live API wiring.</dd>
            </div>
          </dl>
        </section>

        <main className={styles.panel}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

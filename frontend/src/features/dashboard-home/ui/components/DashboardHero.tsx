import { Sparkles } from 'lucide-react';
import styles from './DashboardHero.module.css';

interface DashboardHeroProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function DashboardHero({
  eyebrow,
  title,
  description,
}: DashboardHeroProps) {
  return (
    <section className={styles.hero}>
      <span className={styles.eyebrow}>
        <Sparkles size={16} />
        {eyebrow}
      </span>

      <div className={styles.copy}>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}

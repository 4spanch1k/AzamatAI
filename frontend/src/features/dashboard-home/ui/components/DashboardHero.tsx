import { Sparkles } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import styles from './DashboardHero.module.css';

interface DashboardHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  primaryActionLabel: string;
  onPrimaryAction: () => void;
}

export function DashboardHero({
  eyebrow,
  title,
  description,
  primaryActionLabel,
  onPrimaryAction,
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

      <div className={styles.actions}>
        <Button onClick={onPrimaryAction}>{primaryActionLabel}</Button>
      </div>
    </section>
  );
}

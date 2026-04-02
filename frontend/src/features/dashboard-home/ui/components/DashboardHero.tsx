import { Sparkles } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import styles from './DashboardHero.module.css';

interface DashboardHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
  helperLabel: string;
  helperText: string;
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
}

export function DashboardHero({
  eyebrow,
  title,
  description,
  primaryActionLabel,
  secondaryActionLabel,
  helperLabel,
  helperText,
  onPrimaryAction,
  onSecondaryAction,
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
        <Button variant="ghost" onClick={onSecondaryAction}>
          {secondaryActionLabel}
        </Button>
      </div>

      <div className={styles.helper}>
        <span className={styles.helperLabel}>{helperLabel}</span>
        <p>{helperText}</p>
      </div>
    </section>
  );
}

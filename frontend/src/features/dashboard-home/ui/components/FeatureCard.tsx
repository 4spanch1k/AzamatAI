import { ArrowRight, type LucideIcon } from 'lucide-react';
import clsx from 'clsx';
import type { ModuleTone } from '@/shared/config/navigation';
import { Surface } from '@/shared/ui/Surface';
import styles from './FeatureCard.module.css';

interface FeatureCardProps {
  icon: LucideIcon;
  tone: ModuleTone;
  label: string;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

const toneClassByTone: Record<ModuleTone, string> = {
  cyan: styles.cyan,
  teal: styles.teal,
  amber: styles.amber,
  rose: styles.rose,
};

export function FeatureCard({
  icon: Icon,
  tone,
  label,
  title,
  description,
  actionLabel,
  onAction,
}: FeatureCardProps) {
  return (
    <Surface className={clsx(styles.card, toneClassByTone[tone])}>
      <div className={styles.header}>
        <span className={styles.badge}>{label}</span>
        <span className={styles.iconBox}>
          <Icon size={18} />
        </span>
      </div>

      <div className={styles.copy}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <button className={styles.action} onClick={onAction} type="button">
        {actionLabel}
        <ArrowRight size={16} />
      </button>
    </Surface>
  );
}

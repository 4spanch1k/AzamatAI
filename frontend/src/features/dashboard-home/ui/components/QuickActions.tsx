import { BriefcaseBusiness, TrendingUp } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Surface } from '@/shared/ui/Surface';
import styles from './QuickActions.module.css';

interface QuickActionsProps {
  label: string;
  title: string;
  description: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
  note: string;
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
}

export function QuickActions({
  label,
  title,
  description,
  primaryActionLabel,
  secondaryActionLabel,
  note,
  onPrimaryAction,
  onSecondaryAction,
}: QuickActionsProps) {
  return (
    <Surface className={styles.panel}>
      <span className={styles.label}>{label}</span>

      <div className={styles.copy}>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <div className={styles.actions}>
        <Button fullWidth onClick={onPrimaryAction}>
          <TrendingUp size={16} />
          {primaryActionLabel}
        </Button>

        <Button fullWidth variant="secondary" onClick={onSecondaryAction}>
          <BriefcaseBusiness size={16} />
          {secondaryActionLabel}
        </Button>
      </div>

      <p className={styles.note}>{note}</p>
    </Surface>
  );
}

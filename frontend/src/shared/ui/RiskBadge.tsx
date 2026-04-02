import clsx from 'clsx';
import styles from './RiskBadge.module.css';

type RiskLevel = 'low' | 'medium' | 'high' | 'neutral';

interface RiskBadgeProps {
  level: RiskLevel;
  children: string;
}

export function RiskBadge({ level, children }: RiskBadgeProps) {
  return <span className={clsx(styles.badge, styles[level])}>{children}</span>;
}

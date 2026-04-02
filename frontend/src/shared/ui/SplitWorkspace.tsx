import type { ReactNode } from 'react';
import styles from './SplitWorkspace.module.css';

interface SplitWorkspaceProps {
  left: ReactNode;
  right: ReactNode;
}

export function SplitWorkspace({ left, right }: SplitWorkspaceProps) {
  return (
    <div className={styles.workspace}>
      <div className={styles.column}>{left}</div>
      <div className={styles.column}>{right}</div>
    </div>
  );
}

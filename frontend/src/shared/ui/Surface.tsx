import type { HTMLAttributes, PropsWithChildren } from 'react';
import clsx from 'clsx';
import styles from './Surface.module.css';

export function Surface({
  children,
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div className={clsx(styles.surface, className)} {...props}>
      {children}
    </div>
  );
}

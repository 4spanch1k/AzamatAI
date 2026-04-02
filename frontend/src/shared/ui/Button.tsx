import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import clsx from 'clsx';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

export function Button({
  children,
  className,
  variant = 'primary',
  fullWidth = false,
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={clsx(styles.button, styles[variant], fullWidth && styles.fullWidth, className)}
      {...props}
    >
      {children}
    </button>
  );
}

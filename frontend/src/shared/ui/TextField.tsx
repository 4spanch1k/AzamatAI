import { useId, type InputHTMLAttributes } from 'react';
import styles from './Field.module.css';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

export function TextField({ label, hint, id, ...props }: TextFieldProps) {
  const generatedId = useId();
  const fallbackId = id ?? generatedId;

  return (
    <label className={styles.field} htmlFor={fallbackId}>
      <span className={styles.header}>
        <span className={styles.label}>{label}</span>
        {hint && <span className={styles.hint}>{hint}</span>}
      </span>
      <input className={styles.control} id={fallbackId} {...props} />
    </label>
  );
}

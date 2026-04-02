import { useId, type TextareaHTMLAttributes } from 'react';
import styles from './Field.module.css';

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
}

export function TextAreaField({ label, hint, id, ...props }: TextAreaFieldProps) {
  const generatedId = useId();
  const fallbackId = id ?? generatedId;

  return (
    <label className={styles.field} htmlFor={fallbackId}>
      <span className={styles.header}>
        <span className={styles.label}>{label}</span>
        {hint && <span className={styles.hint}>{hint}</span>}
      </span>
      <textarea className={`${styles.control} ${styles.textarea}`} id={fallbackId} {...props} />
    </label>
  );
}

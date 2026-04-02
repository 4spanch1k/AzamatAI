import styles from './ResultMeta.module.css';

interface ResultMetaProps {
  label: string;
  meta: string;
}

export function ResultMeta({ label, meta }: ResultMetaProps) {
  return (
    <div className={styles.meta}>
      <span className={styles.badge}>{label}</span>
      <span className={styles.text}>{meta}</span>
    </div>
  );
}

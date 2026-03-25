import { useState, type ReactNode } from 'react';
import styles from './Collapsible.module.css';

interface CollapsibleProps {
  title: string;
  children?: ReactNode;
  defaultOpen?: boolean;
}

function Collapsible({
  title,
  children,
  defaultOpen = true,
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className={styles.collapsible}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        className={styles.header}
      >
        <span className={styles.icon} aria-hidden="true">
          {isOpen ? '-' : '+'}
        </span>
        <span className={styles.title}>{title}</span>
      </button>
      {isOpen ? <div className={styles.body}>{children}</div> : null}
    </section>
  );
}

export default Collapsible;

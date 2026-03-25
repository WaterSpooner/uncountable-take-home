import styles from './Dropdown.module.css';

interface DropdownProps<T> {
  options: T[];
  selectedOption: T | '';
  onSelect: (option: T) => void;
  displayText?: string;
  style?: React.CSSProperties;
  className?: string;
}

export function Dropdown<T>(props: DropdownProps<T>) {
  const { options, selectedOption, onSelect, displayText, style, className } =
    props;
  return (
    <select
      value={String(selectedOption)}
      onChange={(e) => onSelect(e.target.value as unknown as T)}
      style={style}
      className={`${styles.dropdown} ${className ?? ''}`}
    >
      {displayText && (
        <option key="" value="" disabled className={styles.default}>
          {displayText}
        </option>
      )}
      {options.map((option) => (
        <option
          key={String(option)}
          value={String(option)}
          className={
            String(option) === String(selectedOption) ? styles.selected : ''
          }
        >
          {String(option)}
        </option>
      ))}
    </select>
  );
}

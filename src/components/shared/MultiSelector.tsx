import { useMemo, useState } from 'react';
import styles from './MultiSelector.module.css';

export interface MultiSelectorProps<T> {
  inputs: T[];
  selectedInputs: T[];
  setSelectedInputs: (inputs: T[]) => void;
}

export function MultiSelector<T>(props: MultiSelectorProps<T>) {
  const { inputs, selectedInputs, setSelectedInputs } = props;
  const [searchTerm, setSearchTerm] = useState('');
  const searchedInputs = useMemo(
    () => searchInputs(inputs, searchTerm),
    [inputs, searchTerm],
  );

  return (
    <div>
      <div className={styles.searchContainer}>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
        />
      </div>
      <div>
        <div
          key={'Select All'}
          className={`${styles.itemContainer} experiment-item`}
        >
          <input
            type="checkbox"
            id="Select All"
            name="Select All"
            checked={selectedInputs.length === inputs.length}
            onChange={(e) => {
              const isChecked = e.target.checked;
              setSelectedInputs(isChecked ? inputs : []);
            }}
            className="experiment-checkbox"
          />
          <label htmlFor="Select All" className="experiment-label">
            <span className={`experiment-id ${styles.selectAllLabel}`}>
              Select All
            </span>
          </label>
        </div>
        {searchedInputs.map((input) => (
          <div
            key={String(input)}
            className={`${styles.itemContainer} experiment-item`}
          >
            <input
              type="checkbox"
              id={String(input)}
              name={String(input)}
              checked={selectedInputs.includes(input)}
              onChange={(e) => {
                const isChecked = e.target.checked;
                const newSelection = isChecked
                  ? [...selectedInputs, input]
                  : selectedInputs.filter((item) => item !== input);
                setSelectedInputs(newSelection as T[]);
              }}
              className="experiment-checkbox"
            />
            <label htmlFor={String(input)} className="experiment-label">
              <span className="experiment-id">{String(input)}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

function searchInputs<T>(inputs: T[], search: string): T[] {
  return inputs.filter((input) =>
    String(input).toLowerCase().includes(search.toLowerCase()),
  );
}

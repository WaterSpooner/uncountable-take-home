import { useEffect, useState } from 'react';
import { FilterComponent } from './FilterComponent';
import type { Filter, PartialFilter } from '../../types/filter';
import type { ExperimentFields } from '../../types/data';
import styles from './FilterFields.module.css';

export interface FilterFieldsProps {
  fields: ExperimentFields;
  filters: Filter[];
  onChange: (filters: Filter[]) => void;
}

export function FilterFields({ fields, filters, onChange }: FilterFieldsProps) {
  const [partialFilters, setPartialFilters] = useState<PartialFilter[]>([]);

  useEffect(() => {
    if (filters.length === 0) {
      setPartialFilters([]);
    }
  }, [filters]);

  return (
    <div>
      <span>
        <button
          className={styles.addFilterButton}
          type="button"
          onClick={() =>
            setPartialFilters((prev) => [...prev, { id: crypto.randomUUID() }])
          }
        >
          New Filter
        </button>
      </span>
      <div className={styles.container}>
        {filters.map((filter) => (
          <FilterComponent
            key={filter.id}
            filter={filter}
            fields={fields}
            updateFilter={(filter) =>
              onChange(filters.map((f) => (f.id === filter.id ? filter : f)))
            }
            deleteFilter={(id) => onChange(filters.filter((f) => f.id !== id))}
          />
        ))}
        {partialFilters.map((filter) => (
          <FilterComponent
            key={filter.id}
            filter={filter}
            fields={fields}
            updateFilter={(filter) => {
              setPartialFilters((prev) =>
                prev.filter((f) => f.id !== filter.id),
              );
              onChange([...filters, filter]);
            }}
            deleteFilter={(id) => {
              setPartialFilters((prev) => prev.filter((f) => f.id !== id));
            }}
          />
        ))}
      </div>
    </div>
  );
}

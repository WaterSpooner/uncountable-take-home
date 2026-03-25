import { useState } from 'react';
import { FilterFields } from '../filters/FilterFields';
import Collapsible from '../layout/Collapsible';
import { MultiSelector } from '../shared/MultiSelector';
import styles from './RightNavbar.module.css';
import { BiFilter } from 'react-icons/bi';
import { useFilterPanel } from '../../context/FilterPanelContext';

function FilterPanel() {
  const [isExpanded, setIsExpanded] = useState(true);
  const {
    fields,
    experimentIds,
    fieldNames,
    selectedExperiments,
    setSelectedExperiments,
    selectedFields,
    setSelectedFields,
    filters,
    setFilters,
    resetSelections,
  } = useFilterPanel();

  return (
    <div
      className={`${styles.navbar} ${isExpanded ? styles.expanded : styles.collapsed}`}
    >
      <div className={styles.headerRow}>
        {isExpanded && <h2 style={{ margin: 0 }}>Filters</h2>}
        <button
          className={styles.toggleButton}
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-label={
            isExpanded ? 'Collapse filters panel' : 'Expand filters panel'
          }
        >
          {isExpanded ? 'x' : <BiFilter size={20} />}
        </button>
      </div>
      {isExpanded && (
        <>
          <div className={styles.actionsRow}>
            <button type="reset" onClick={resetSelections}>
              Reset
            </button>
          </div>
          <div className={styles.content}>
            <Collapsible title="Experiments" defaultOpen={false}>
              <MultiSelector
                inputs={experimentIds}
                selectedInputs={selectedExperiments}
                setSelectedInputs={setSelectedExperiments}
              />
            </Collapsible>
            <Collapsible title="Fields" defaultOpen={false}>
              <MultiSelector
                inputs={fieldNames}
                selectedInputs={selectedFields}
                setSelectedInputs={setSelectedFields}
              />
            </Collapsible>
            <Collapsible title="Filters" defaultOpen={false}>
              <FilterFields
                filters={filters}
                fields={fields}
                onChange={setFilters}
              />
            </Collapsible>
          </div>
        </>
      )}
    </div>
  );
}

export { FilterPanel };

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Filter } from '../types/filter';
import type {
  ExperimentId,
  ExperimentFields,
  ExperimentField,
} from '../types/data';

interface FilterPanelContextValue {
  fields: ExperimentFields;
  experimentIds: ExperimentId[];
  fieldNames: ExperimentField[];
  selectedExperiments: ExperimentId[];
  setSelectedExperiments: (experimentIds: ExperimentId[]) => void;
  selectedFields: ExperimentField[];
  setSelectedFields: (fieldIds: ExperimentField[]) => void;
  filters: Filter[];
  setFilters: (filters: Filter[]) => void;
  resetSelections: () => void;
}

interface FilterPanelProviderProps {
  fields: ExperimentFields;
  experimentIds: ExperimentId[];
  children: ReactNode;
}

const FilterPanelContext = createContext<FilterPanelContextValue | undefined>(
  undefined,
);

function FilterPanelProvider({
  fields,
  experimentIds,
  children,
}: FilterPanelProviderProps) {
  const fieldNames = useMemo(
    () => Object.values(fields).flat() as ExperimentField[],
    [fields],
  );
  const [selectedExperiments, setSelectedExperiments] =
    useState<ExperimentId[]>(experimentIds);
  const [selectedFields, setSelectedFields] =
    useState<ExperimentField[]>(fieldNames);
  const [filters, setFilters] = useState<Filter[]>([]);

  const resetSelections = () => {
    setSelectedExperiments(experimentIds);
    setSelectedFields(fieldNames);
    setFilters([]);
  };

  return (
    <FilterPanelContext.Provider
      value={{
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
      }}
    >
      {children}
    </FilterPanelContext.Provider>
  );
}

function useFilterPanel() {
  const context = useContext(FilterPanelContext);
  if (!context) {
    throw new Error('useFilterPanel must be used within a FilterPanelProvider');
  }
  return context;
}

export { FilterPanelProvider, useFilterPanel };

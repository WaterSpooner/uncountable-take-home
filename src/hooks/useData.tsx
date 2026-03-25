import type {Filter} from '../types/filter'
import type { Dataset, Experiment, ExperimentId } from '../types/data'
import { useMemo } from 'react';

export function useData(dataset: Dataset, filters: Filter[], selectedExperiments: ExperimentId[]) {
    const filteredData = useMemo(() => {
        return Object.fromEntries(
            Object.entries(dataset)
                .filter(([_, experiment]) => applyFilter(experiment, filters))
                .filter(([experimentId, _]) => selectedExperiments.includes(experimentId as ExperimentId))
        ) as Dataset;
    }, [dataset, filters, selectedExperiments]);

    return filteredData;
}

function applyFilter(experiment: Experiment, filters: Filter[]) {
    return filters.every(filter => evaluateFilter(experiment, filter));
}

function evaluateFilter(experiment: Experiment, filter: Filter) {
    let fieldValue: number;
    if (filter.fieldType === "inputs") {
        fieldValue = experiment.inputs[filter.field as keyof typeof experiment.inputs];
    } else if (filter.fieldType === "outputs") {
        fieldValue = experiment.outputs[filter.field as keyof typeof experiment.outputs];
    } else {
        return false;
    }
    switch (filter.operator) {
        case ">":
            return fieldValue > filter.value;
        case "<":
            return fieldValue < filter.value;
        case "=":
            return fieldValue === filter.value;
        case "!=":
            return fieldValue !== filter.value;
        default:
            return false;
    }
}
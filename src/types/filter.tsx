import type { ExperimentField, ExperimentFieldType } from "./data";

export interface Filter {
    id: string;
    field: ExperimentField;
    fieldType: ExperimentFieldType;
    operator: ">" | "<" | "=" | "!=";
    value: number;
}

export interface PartialFilter {
    id: string;
    field?: ExperimentField;
    fieldType?: ExperimentFieldType;
    operator?: ">" | "<" | "=" | "!=";
    value?: number;
}

export const operators: Filter['operator'][] = [">", "<", "=", "!="];
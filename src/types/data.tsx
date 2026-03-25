export interface ExperimentInputs {
  "Polymer 1": number;
  "Polymer 2": number;
  "Polymer 3": number;
  "Polymer 4": number;
  "Carbon Black High Grade": number;
  "Carbon Black Low Grade": number;
  "Silica Filler 1": number;
  "Silica Filler 2": number;
  "Plasticizer 1": number;
  "Plasticizer 2": number;
  "Plasticizer 3": number;
  "Antioxidant": number;
  "Coloring Pigment": number;
  "Co-Agent 1": number;
  "Co-Agent 2": number;
  "Co-Agent 3": number;
  "Curing Agent 1": number;
  "Curing Agent 2": number;
  "Oven Temperature": number;
}

export interface ExperimentOutputs {
  "Viscosity": number;
  "Cure Time": number;
  "Elongation": number;
  "Tensile Strength": number;
  "Compression Set": number;
}

export interface Experiment {
  inputs: ExperimentInputs;
  outputs: ExperimentOutputs;
}

export type ExperimentId = string;

export type Dataset = Record<ExperimentId, Experiment>;

export type InputField = keyof ExperimentInputs;
export type OutputField = keyof ExperimentOutputs;
export type ExperimentField = InputField | OutputField;

export const inputFields: InputField[] = [
  "Polymer 1",
  "Polymer 2",
  "Polymer 3",
  "Polymer 4",
  "Carbon Black High Grade",
  "Carbon Black Low Grade",
  "Silica Filler 1",
  "Silica Filler 2",
  "Plasticizer 1",
  "Plasticizer 2",
  "Plasticizer 3",
  "Antioxidant",
  "Coloring Pigment",
  "Co-Agent 1",
  "Co-Agent 2",
  "Co-Agent 3",
  "Curing Agent 1",
  "Curing Agent 2",
  "Oven Temperature",
];

export const outputFields: OutputField[] = [
  "Viscosity",
  "Cure Time",
  "Elongation",
  "Tensile Strength",
  "Compression Set",
];

export const experimentFields: ExperimentField[] = [...inputFields, ...outputFields];

export type ExperimentFieldType = keyof Experiment;

export type ExperimentFields = Record<ExperimentFieldType, ExperimentField[]>;
export const experimentFieldsMap: ExperimentFields = {
  inputs: inputFields,
  outputs: outputFields,
};
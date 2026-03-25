import { Dropdown } from "../shared/Dropdown";
import type { Filter, PartialFilter } from "../../types/filter";
import type { InputField, OutputField, ExperimentFieldType, ExperimentFields } from "../../types/data";
import { operators } from "../../types/filter";
import { useEffect, useState } from "react";
import styles from './FilterComponent.module.css'

export interface FilterComponentProps {
    filter: PartialFilter;
    fields: ExperimentFields;
    updateFilter: (filter: Filter) => void;
    deleteFilter: (filter: Filter['id']) => void;
}


export function FilterComponent(props: FilterComponentProps) {
    const {fields, updateFilter, deleteFilter, filter} = props;
    const [fieldType, setFieldType] = useState<ExperimentFieldType | "">(filter.fieldType ?? "");
    const [field, setField] = useState<InputField | OutputField | "">(filter.field ?? "");
    const [operator, setOperator] = useState<Filter['operator'] | "">(filter.operator ?? "=");
    const [value, setValue] = useState<number>(0);

    useEffect(() => {
        if (fieldType && field && operator) {
            updateFilter({
                id: filter.id,
                field: field,
                fieldType,
                operator,
                value
            });
        }
    }, [fieldType, field, operator, value, filter.id]);

    return (
        <div className={styles.container}>
            <span className={styles.field}>
                <h4 className={styles.label}>Field Type:</h4>
                <Dropdown displayText={"Field Type"} options={Object.keys(fields) as ExperimentFieldType[]} selectedOption={fieldType} onSelect={(option) => setFieldType(option as ExperimentFieldType | "")} />
            </span>
            <span className={styles.field}>
                <h4 className={styles.label}>Field:</h4>
                <Dropdown displayText={"Field"} options={fieldType ? fields[fieldType] : []} selectedOption={field} onSelect={(option) => setField(option)} />
            </span>
            <span className={styles.field}>
                <h4 className={styles.label}>Operator:</h4>
                <Dropdown displayText={"Operator"} options={operators} selectedOption={operator} onSelect={(option) => setOperator(option)} />
            </span>
            <span className={styles.field}>
                <h4 className={styles.label}>Value:</h4>
                <input className={styles.input} type="number" value={value} onChange={(event) => setValue(Number(event.target.value))} />
            </span>
            <button type="reset" className={styles.deleteButton} onClick={() => deleteFilter(filter.id)}>
                Delete
            </button>
        </div>
    )
}
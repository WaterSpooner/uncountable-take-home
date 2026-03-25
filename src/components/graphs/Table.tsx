import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  createColumnHelper,
} from '@tanstack/react-table';
import type { Table as TableType } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import type {
  ExperimentId,
  ExperimentInputs,
  ExperimentOutputs,
  Dataset,
  ExperimentField,
} from '../../types/data';
import { Dropdown } from '../shared/Dropdown';
import styles from './Table.module.css';

type ExperimentRow = {
  id: ExperimentId;
} & ExperimentInputs &
  ExperimentOutputs;

const columnHelper = createColumnHelper<ExperimentRow>();

export interface TableProps {
  dataset: Dataset;
  selectedFields: ExperimentField[];
}

export function Table({ dataset, selectedFields }: TableProps) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const formattedData = useMemo(() => {
    return Object.entries(dataset).map(([id, experiment]) => ({
      id,
      ...experiment.inputs,
      ...experiment.outputs,
    }));
  }, [dataset]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('id' as const, {
        header: 'ID',
        size: 120,
        enableSorting: true,
      }),
      ...selectedFields.map((field) =>
        columnHelper.accessor(
          (row) =>
            row[field as keyof ExperimentRow] ?? ('' as unknown as string),
          {
            header: field,
            size: 150,
            enableSorting: true,
          },
        ),
      ),
    ],
    [selectedFields],
  );

  const table = useReactTable({
    data: formattedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination,
    },
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    manualPagination: false,
    enableSorting: true,
    enableSortingRemoval: true,
  });

  const visibleRows = table.getRowModel().rows;
  const emptyRowCount = Math.max(0, pagination.pageSize - visibleRows.length);

  if (selectedFields.length === 0) {
    return <div>Please select at least one field to display.</div>;
  }

  return (
    <>
      <div className={styles.tableContainer}>
        <table
          className={styles.table}
          style={{
            width: table.getTotalSize(),
            minWidth: '100%',
            tableLayout: 'fixed' as const,
          }}
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={styles.th}
                    style={{ width: header.getSize() }}
                  >
                    <div
                      className={styles.sortHeader}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {{
                        asc: ' ↑',
                        desc: ' ↓',
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={row.id} className={styles.row}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={styles.td}
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {Array.from({ length: emptyRowCount }).map((_, index) => (
              <tr key={`empty-row-${index}`} className={styles.emptyRow}>
                <td
                  colSpan={table.getVisibleLeafColumns().length}
                  className={styles.emptyCell}
                >
                  &nbsp;
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <span className={styles.pagination}>
        <Dropdown
          options={[10, 20, 50, 100]}
          selectedOption={pagination.pageSize}
          onSelect={(value) =>
            setPagination((prev) => ({ ...prev, pageSize: value }))
          }
        />
        <button
          type="button"
          className={styles.pageButton}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </button>
        <button
          type="button"
          className={styles.pageButton}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
        <button
          type="button"
          className={styles.exportButton}
          onClick={() => saveAsCSV(table)}
        >
          Export Data
        </button>
      </span>
    </>
  );
}

function saveAsCSV<TData>(table: TableType<TData>) {
  const headers = table.getAllColumns().map((col) => col.columnDef.header);
  const rows = table.getPrePaginationRowModel().rows.map((row) =>
    row.getVisibleCells().map((cell) => {
      const cellValue = cell.getValue();
      if (typeof cellValue === 'string') {
        return `"${cellValue.replace(/"/g, '""')}"`;
      }
      return cellValue;
    }),
  );
  const csvContent = [headers, ...rows].map((e) => e.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'table_data.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

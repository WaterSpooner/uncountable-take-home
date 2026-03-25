import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from 'recharts';
import { useMemo, useState } from 'react';
import type { OutputField, InputField, Dataset } from '../../types/data';
import { Dropdown } from '../shared/Dropdown';
import { MultiSelector } from '../shared/MultiSelector';
import styles from './Scatter.module.css';

export interface ScatterPlotProps {
  dataset: Dataset;
  xAxisOptions: InputField[];
  yAxisOptions: OutputField[];
}

interface TooltipPayloadEntry {
  name?: string;
  value?: unknown;
  color?: string;
  payload?: Record<string, unknown>;
}

interface ScatterTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
}

export default function ScatterPlot({
  dataset,
  xAxisOptions,
  yAxisOptions,
}: ScatterPlotProps) {
  const [xAxis, setXAxis] = useState<InputField | ''>('');
  const [yAxis, setYAxis] = useState<OutputField[]>([]);

  const formattedData = useMemo(
    () => formatData(dataset, xAxis, yAxis),
    [dataset, xAxis, yAxis],
  );

  return (
    <div className={styles.container}>
      <ResponsiveContainer width="100%" height={600}>
        <ScatterChart>
          <CartesianGrid />
          <XAxis
            type="number"
            dataKey={xAxis}
            name={xAxis}
            domain={['dataMin', 'dataMax']}
          >
            <Label value={xAxis} offset={0} position="insideBottom" />
          </XAxis>
          {yAxis.map((yLabel) => (
            <YAxis
              type="number"
              dataKey={yLabel}
              yAxisId={yLabel}
              name={yLabel}
              key={yLabel}
            >
              <Label
                value={yLabel}
                offset={20}
                position="insideLeft"
                angle={-90}
                textAnchor="middle"
              />
            </YAxis>
          ))}
          {yAxis.map((yLabel) => (
            <Scatter
              key={yLabel}
              data={formattedData}
              dataKey={yLabel}
              yAxisId={yLabel}
              fill="#8884d8"
              name={yLabel}
              isAnimationActive={false}
            />
          ))}
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={<ScatterTooltip />}
          />
        </ScatterChart>
      </ResponsiveContainer>
      <span>
        <div className={styles.controlsGrid}>
          <Dropdown
            className={styles.axisDropdown}
            displayText={'Select X-Axis'}
            options={xAxisOptions}
            selectedOption={xAxis}
            onSelect={(option) => setXAxis(option as InputField | '')}
          />
          <MultiSelector
            inputs={yAxisOptions}
            selectedInputs={yAxis}
            setSelectedInputs={(selected) =>
              setYAxis(selected as OutputField[])
            }
          />
        </div>
        <div></div>
      </span>
    </div>
  );
}

function formatData(
  dataset: Dataset,
  xLabel: InputField | '',
  yLabel: OutputField[],
): Array<Record<string, unknown>> {
  if (!xLabel || yLabel.length === 0) {
    return [];
  }
  return Object.entries(dataset).map(([experimentId, experiment]) => {
    const point: Record<string, unknown> = { experimentId };
    point[String(xLabel)] = experiment.inputs[xLabel];
    yLabel.forEach((y) => {
      point[String(y)] = experiment.outputs[y];
    });
    return point;
  });
}

function ScatterTooltip({ active, payload }: ScatterTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const point = payload[0]?.payload ?? {};
  const experimentId = String(point.experimentId ?? '');

  return (
    <div className={styles.tooltipBox}>
      <div className={styles.tooltipTitle}>Experiment: {experimentId}</div>
      {payload.map((entry) => (
        <div
          key={String(entry.name)}
          style={{ color: entry.color ?? '#111827' }}
        >
          {String(entry.name)}: {String(entry.value ?? '')}
        </div>
      ))}
    </div>
  );
}

export { ScatterPlot };

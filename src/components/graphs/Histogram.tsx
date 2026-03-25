import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMemo, useState } from "react";
import type { Dataset, InputField } from "../../types/data";
import { Dropdown } from "../shared/Dropdown";
import styles from "./Histogram.module.css";

type HistogramBin = { binStart: number; binEnd: number; count: number };

function buildHistogram(
  data: Array<Record<string, unknown>>,
  xKey: string,
  binCount = 10
): HistogramBin[] {
  const values = data
    .map((d) => Number(d[xKey]))
    .filter((v) => Number.isFinite(v));

  if (values.length === 0) return [];

  const min = Math.min(...values);
  const max = Math.max(...values);
  const width = (max - min) / binCount || 1;

  const bins: HistogramBin[] = Array.from({ length: binCount }, (_, i) => ({
    binStart: min + i * width,
    binEnd: min + (i + 1) * width,
    count: 0,
  }));

  values.forEach((v) => {
    let idx = Math.floor((v - min) / width);
    if (idx >= binCount) idx = binCount - 1;
    if (idx < 0) idx = 0;
    bins[idx].count += 1;
  });

  return bins;
}

export function Histogram({ dataset, xAxisOptions }: { dataset: Dataset; xAxisOptions: InputField[] }) {
  const [xAxis, setXAxis] = useState<InputField | "">("");

  const flatData = useMemo(() => {
    return Object.values(dataset).map((experiment) => ({
      ...experiment.inputs,
      ...experiment.outputs,
    }));
  }, [dataset]);

  const histogramData = useMemo(() => {
    return xAxis ? buildHistogram(flatData, String(xAxis), 14) : [];
  }, [flatData, xAxis]);

  return (
    <div>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={histogramData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="binStart"
              tickFormatter={(v: number, idx: number) => {
                const bin = histogramData[idx];
                if (!bin) return v.toFixed(2);
                return `${bin.binStart.toFixed(2)}-${bin.binEnd.toFixed(2)}`;
              }}
              interval={0}
              label={{ value: String(xAxis), position: "insideBottom", offset: -5 }}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(label) => {
                const binStart = Number(label);
                const bin = histogramData.find((b) => b.binStart === binStart);
                if (!bin) return "";
                return `${bin.binStart.toFixed(2)}–${bin.binEnd.toFixed(2)}`;
              }}
              formatter={(value) => [`${value} counts`, "Frequency"]}
            />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.controlsRow}>
        <Dropdown
          className={styles.axisDropdown}
          displayText="Select Histogram Field"
          options={xAxisOptions}
          selectedOption={xAxis}
          onSelect={(option) => setXAxis(option as InputField | "")}
        />
      </div>
    </div>
  );
}

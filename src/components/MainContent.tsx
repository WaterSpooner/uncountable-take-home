import styles from './MainContent.module.css'
import { ScatterPlot } from './graphs/Scatter';
import { Histogram } from './graphs/Histogram';
import { Table } from './graphs/Table';
import { useState } from 'react'
import { data } from '../data/sampleDataset';
import { experimentFieldsMap,inputFields, outputFields } from "../types/data";
import { FilterPanel } from './layout/RighSidePanel';
import { useData } from '../hooks/useData';
import { FaTableList } from "react-icons/fa6";
import { BiScatterChart } from "react-icons/bi";
import { TbChartHistogram } from "react-icons/tb";
import { LeftNavbar } from './layout/LeftSidePanel';
import { FilterPanelProvider, useFilterPanel } from '../context/FilterPanelContext';
import type { ExperimentId } from '../types/data';

function MainContent() {
  const experimentIds = Object.keys(data) as ExperimentId[];
  return (
    <FilterPanelProvider fields={experimentFieldsMap} experimentIds={experimentIds}>
      <MainContentBody />
    </FilterPanelProvider>
  )
}

function MainContentBody() {
  const [graphType, setGraphType] = useState<string>("table");
  const { selectedExperiments, selectedFields, filters } = useFilterPanel();

  const filteredData = useData(data, filters, selectedExperiments);

  return (
    <div className={styles.appContainer}>
      <LeftNavbar navItems={[
        { id: "scatter", name: "Scatter", icon: <BiScatterChart /> },
        { id: "histogram", name: "Histogram", icon: <TbChartHistogram /> },
        { id: "table", name: "Table", icon: <FaTableList /> }
      ]} 
      onChange={setGraphType} 
      selectedId={graphType}
      />
      <main className={styles.main}>
        {graphType === "scatter" && <ScatterPlot dataset={filteredData} xAxisOptions={inputFields} yAxisOptions={outputFields} />}
        {graphType === "histogram" && <Histogram dataset={filteredData} xAxisOptions={inputFields} />}
        {graphType === "table" && <Table dataset={filteredData} selectedFields={selectedFields}/>}
      </main>
      <FilterPanel />
    </div>
  )
}



export default MainContent
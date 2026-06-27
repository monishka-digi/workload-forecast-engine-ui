import "./JobVolume.css";

import DashboardLayout from "../components/Dashboard/DashboardLayout";

import KpiCard from "../components/KPI/KpiCard";

import ForecastChart from "../components/Charts/ForecastChart";

import MachineMixChart from "../components/Charts/MachineMixChart";

import BranchChart from "../components/Charts/BranchChart";

import CapacityPressure from "../components/Gauge/CapacityPressure";

import PredictionTable from "../components/Table/PredictionTable";

import useJobVolume from "../hooks/useJobVolume";

export default function JobVolume() {
  const {
    loading,

    error,

    dashboard,
  } = useJobVolume();

  console.log("Dashboard:", dashboard);
console.log("Loading:", loading);
console.log("Error:", error);

  if (!dashboard) {
    return null;
  }

  const KPISection = (
    <div className="kpiGrid">
      {dashboard.kpis.map((item) => (
        <KpiCard key={item.title} {...item} />
      ))}
    </div>
  );

  return (
    <DashboardLayout
      loading={loading}
      error={error}
      kpis={KPISection}
      topLeft={<ForecastChart data={dashboard.charts.forecast} />}
      topRight={<MachineMixChart data={dashboard.charts.machineMix} />}
      bottomLeft={<BranchChart data={dashboard.charts.branch} />}
      bottomRight={<CapacityPressure data={dashboard.charts.capacity} />}
      table={<PredictionTable rows={dashboard.table.rows} />}
    />
  );
}

import "./JobVolume.css";

import DashboardLayout from "../../components/Common/DashboardLayout";
import KpiCard from "../../components/Common/KpiCard";
import ForecastChart from "./components/ForecastChart";
import MachineMixChart from "./components/MachineMixChart";
import BranchChart from "./components/BranchChart";
import CapacityPressure from "./components/CapacityPressure";
import PredictionTable from "./components/PredictionTable";
import useJobVolume from "./hooks/useJobVolume";

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

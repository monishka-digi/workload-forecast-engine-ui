import { useEffect } from "react";
import "./JobVolume.css";

import DashboardLayout from "../../components/Common/DashboardLayout";
import KpiCard from "../../components/Common/KpiCard";
import ForecastChart from "./components/ForecastChart";
import MachineMixChart from "./components/MachineMixChart";
import BranchChart from "./components/BranchChart";
import CapacityPressure from "./components/CapacityPressure";
import PredictionTable from "./components/PredictionTable";
import useJobVolume from "./hooks/useJobVolume";

import useDashboardFilters from "../../context/useDashboardFilters";

export default function JobVolume() {
  const { forecastDays, selectedBranch, setBranchOptions } = useDashboardFilters();
  const { dashboard, loading, error } = useJobVolume(
    selectedBranch,
    forecastDays,
  );

  // Sync branch options from API response into the shared filter context
  // so the Topbar dropdown reflects the live data.
  useEffect(() => {
    if (dashboard?.filters?.branch_options?.length) {
      setBranchOptions(dashboard.filters.branch_options);
    }
  }, [dashboard, setBranchOptions]);

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
      topRight={
        <MachineMixChart
          data={dashboard.charts.machineMix}
          selectedBranch={selectedBranch}
        />
      }
      middleLeft={
        <BranchChart data={dashboard.charts.branch} selectedBranch={selectedBranch} />
      }
      bottomLeft={
        <CapacityPressure
          data={dashboard.charts.capacity}
          selectedBranch={selectedBranch}
        />
      }
      table={<PredictionTable rows={dashboard.table.rows} forecastDays={forecastDays} />}
    />
  );
}

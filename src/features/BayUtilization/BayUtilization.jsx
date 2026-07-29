import { useEffect } from "react";
import useBayUtilization from "./hooks/useBayUtilization";
import DashboardLayout from "../../components/Common/DashboardLayout";
import KpiCard from "../../components/Common/KpiCard";
import BayUtilizationChart from "./components/BayUtilizationChart";
import BayHeatmap from "./components/BayHeatmap";
import BayUtilizationTable from "./components/BayUtilizationTable";
import useDashboardFilters from "../../context/useDashboardFilters";

export default function BayUtilization() {
  const { forecastDays, selectedBranch, setBranchOptions } =
    useDashboardFilters();
  const { loading, error, dashboard } = useBayUtilization(
    selectedBranch,
    forecastDays,
  );

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
      topLeft={
        <BayUtilizationChart
          data={dashboard.charts.utilization}
          forecastDays={forecastDays}
        />
      }
      topRight={<BayHeatmap data={dashboard.charts.heatmap} />}
      table={<BayUtilizationTable rows={dashboard.table.rows} />}
    />
  );
}

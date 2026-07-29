import { useEffect } from "react";

import DashboardLayout from "../../components/Common/DashboardLayout";
import KpiCard from "../../components/Common/KpiCard";
import useDashboardFilters from "../../context/useDashboardFilters";
import BranchLoadGauge from "./components/BranchLoadGauge";
import BranchLoadTrendChart from "./components/BranchLoadTrendChart";
import BranchLoadTable from "./components/BranchLoadTable";
import useBranchLoad from "./hooks/useBranchLoad";

export default function BranchLoad() {
  const { forecastDays, selectedBranch, setBranchOptions } =
    useDashboardFilters();
  const { loading, error, dashboard } = useBranchLoad(
    selectedBranch,
    forecastDays,
  );

  useEffect(() => {
    if (dashboard?.filters?.branch_options?.length) {
      setBranchOptions(dashboard.filters.branch_options);
    }
  }, [dashboard, setBranchOptions]);

  if (!dashboard) return null;

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
        <BranchLoadGauge
          data={dashboard.charts.gauge}
          selectedBranch={selectedBranch}
          forecastDays={forecastDays}
        />
      }
      topRight={
        <BranchLoadTrendChart
          chart={dashboard.charts.trend}
          selectedBranch={selectedBranch}
        />
      }
      table={<BranchLoadTable rows={dashboard.table.rows} />}
    />
  );
}

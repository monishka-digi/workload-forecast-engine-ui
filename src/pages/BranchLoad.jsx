import DashboardLayout from "../components/Dashboard/DashboardLayout";
import KpiCard from "../components/KPI/KpiCard";
import BranchLoadGauge from "../components/BranchLoad/BranchLoadGauge";
import BranchLoadTrendChart from "../components/BranchLoad/BranchLoadTrendChart";
import BranchLoadTable from "../components/BranchLoad/BranchLoadTable";

import useBranchLoad from "../hooks/useBranchLoad";

export default function BranchLoad() {
  const { loading, error, dashboard } = useBranchLoad();

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
      topLeft={<BranchLoadGauge data={dashboard.charts.gauge} />}
      topRight={<BranchLoadTrendChart chart={dashboard.charts.trend} />}
      table={<BranchLoadTable rows={dashboard.table.rows} />}
    />
  );
}

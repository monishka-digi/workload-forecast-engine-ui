import DashboardLayout from "../../components/Common/DashboardLayout";
import KpiCard from "../../components/Common/KpiCard";
import BranchLoadGauge from "./components/BranchLoadGauge";
import BranchLoadTrendChart from "./components/BranchLoadTrendChart";
import BranchLoadTable from "./components/BranchLoadTable";

import useBranchLoad from "./hooks/useBranchLoad";

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

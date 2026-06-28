import useBayUtilization from "../hooks/useBayUtilization";
import DashboardLayout from "../components/Dashboard/DashboardLayout";
import KpiCard from "../components/KPI/KpiCard";
import BayUtilizationChart from "../components/BayUtilization/BayUtilizationChart";
import BayHeatmap from "../components/BayUtilization/BayHeatmap";
import BayUtilizationTable from "../components/BayUtilization/BayUtilizationTable";

export default function BayUtilization() {
  const { loading, error, dashboard } = useBayUtilization();

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
      topLeft={<BayUtilizationChart data={dashboard.charts.utilization} />}
      topRight={<BayHeatmap data={dashboard.charts.heatmap} />}
      table={<BayUtilizationTable rows={dashboard.table.rows} />}
    />
  );
}

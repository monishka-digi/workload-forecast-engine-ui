import DashboardLayout from "../components/Dashboard/DashboardLayout";
import KpiCard from "../components/KPI/KpiCard";

import CategoryDemandChart from "../components/ComponentDemand/CategoryDemandChart";
import BranchCategoryMixChart from "../components/ComponentDemand/BranchCategoryMixChart";
import ComponentDemandTable from "../components/ComponentDemand/ComponentDemandTable";

import useComponentDemand from "../hooks/useComponentDemand";

export default function ComponentDemand() {
  const { loading, error, dashboard } = useComponentDemand();

  if (!dashboard) return null;

  const kpiSection = (
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
      kpis={kpiSection}
      topLeft={<CategoryDemandChart data={dashboard.charts.categoryDemand} />}
      // topRight={
      //   <BranchCategoryMixChart data={dashboard.charts.branchCategoryMix} />
      // }
      table={<ComponentDemandTable rows={dashboard.table.rows} />}
    />
  );
}

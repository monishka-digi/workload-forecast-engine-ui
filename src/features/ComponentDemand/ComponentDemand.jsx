import DashboardLayout from "../../components/Common/DashboardLayout";
import KpiCard from "../../components/Common/KpiCard";

import CategoryDemandChart from "./components/CategoryDemandChart";
import BranchCategoryMixChart from "./components/BranchCategoryMixChart";
import ComponentDemandTable from "./components/ComponentDemandTable";

import useComponentDemand from "./hooks/useComponentDemand";

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
      topRight={
        <BranchCategoryMixChart data={dashboard.charts.branchCategoryMix} />
      }
      table={<ComponentDemandTable rows={dashboard.table.rows} />}
    />
  );
}

import { useEffect } from "react";

import DashboardLayout from "../../components/Common/DashboardLayout";
import KpiCard from "../../components/Common/KpiCard";
import useDashboardFilters from "../../context/useDashboardFilters";
import BranchCategoryMixChart from "./components/BranchCategoryMixChart";
import CategoryDemandChart from "./components/CategoryDemandChart";
import ComponentDemandTable from "./components/ComponentDemandTable";
import useComponentDemand from "./hooks/useComponentDemand";

export default function ComponentDemand() {
  const { forecastDays, selectedBranch, setBranchOptions } =
    useDashboardFilters();
  const { loading, error, dashboard } = useComponentDemand(
    selectedBranch,
    forecastDays,
  );

  useEffect(() => {
    if (dashboard?.filters?.branch_options?.length) {
      setBranchOptions(dashboard.filters.branch_options);
    }
  }, [dashboard, setBranchOptions]);

  if (!dashboard && !loading && !error) {
    return null;
  }

  const kpiSection = dashboard ? (
    <div className="kpiGrid">
      {dashboard.kpis.map((item) => (
        <KpiCard key={item.title} {...item} />
      ))}
    </div>
  ) : null;

  return (
    <DashboardLayout
      loading={loading}
      error={error}
      kpis={kpiSection}
      topLeft={dashboard ? <CategoryDemandChart data={dashboard.charts.categoryDemand} /> : null}
      topRight={dashboard ? <BranchCategoryMixChart data={dashboard.charts.branchCategoryMix} /> : null}
      table={dashboard ? <ComponentDemandTable rows={dashboard.table.rows} /> : null}
    />
  );
}

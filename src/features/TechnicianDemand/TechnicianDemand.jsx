import { useEffect } from "react";

import DashboardLayout from "../../components/Common/DashboardLayout";
import KpiCard from "../../components/Common/KpiCard";
import useDashboardFilters from "../../context/useDashboardFilters";
import BranchGapChart from "./components/BranchGapChart";
import HeadcountTrendChart from "./components/HeadcountTrendChart";
import SkillDemandChart from "./components/SkillDemandChart";
import TechnicianDemandTable from "./components/TechnicianDemandTable";
import WorkforcePlanning from "./components/WorkforcePlanning";
import useTechnicianDemand from "./hooks/useTechnicianDemand";
import BranchGapSummary from "./components/BranchGapSummary";

export default function TechnicianDemand() {
  const { forecastDays, selectedBranch, setBranchOptions } =
    useDashboardFilters();
  const { dashboard, loading, error } = useTechnicianDemand(
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

  const KPISection = dashboard ? (
    <div className="kpiSection">
      {dashboard.kpis.map((item) => (
        <KpiCard key={item.title} {...item} />
      ))}
    </div>
  ) : null;

  return (
    <DashboardLayout
      loading={loading}
      error={error}
      kpis={KPISection}
      topLeft={
        dashboard ? <SkillDemandChart data={dashboard.charts.skill} /> : null
      }
      topRight={
        dashboard ? <WorkforcePlanning planning={dashboard.planning} /> : null
      }
      middleLeft={
        dashboard ? (
          <HeadcountTrendChart data={dashboard.charts.headcountTrend} />
        ) : null
      }
      middleRight={
        dashboard ? (
          <BranchGapChart
            data={dashboard.charts.branchGap}
            summary={dashboard.branchGapSummary}
            selectedBranch={selectedBranch}
          />
        ) : null
      }
      bottomLeft={
        dashboard ? (
          <BranchGapSummary summary={dashboard.branchGapSummary} />
        ) : null
      }
      bottomRight={null}
      table={
        dashboard ? <TechnicianDemandTable rows={dashboard.table.rows} /> : null
      }
    />
  );
}

import { useEffect } from "react";

import DashboardLayout from "../../components/Common/DashboardLayout";
import KpiCard from "../../components/Common/KpiCard";
import useDashboardFilters from "../../context/useDashboardFilters";
// import BranchGapChart from "./components/BranchGapChart";
// import BranchGapSummary from "./components/BranchGapSummary";
import BranchHeadcountGapChart from "./components/BranchHeadcountGapChart";
import GeographyWorkforceChart from "./components/GeographyWorkforceChart";
import HeadcountTrendChart from "./components/HeadcountTrendChart";
import HiringPipelineTable from "./components/HiringPipelineTable";
import OvertimeRiskChart from "./components/OvertimeRiskChart";
// import SkillDemandChart from "./components/SkillDemandChart";
import TechnicianDemandTable from "./components/TechnicianDemandTable";
// import WorkforcePlanning from "./components/WorkforcePlanning";
import useTechnicianDemand from "./hooks/useTechnicianDemand";

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
      // topLeft={
      //   dashboard ? <SkillDemandChart data={dashboard.charts.skill} /> : null
      // }
      // topRight={
      //   dashboard ? <WorkforcePlanning planning={dashboard.planning} /> : null
      // }
      middleLeft={
        dashboard ? (
          <HeadcountTrendChart data={dashboard.charts.headcountTrend} />
        ) : null
      }
      // middleRight={
      //   dashboard ? <BranchGapChart data={dashboard.charts.branchGap} /> : null
      // }
      // bottomLeft={
      //   dashboard ? (
      //     <BranchGapSummary summary={dashboard.branchGapSummary} />
      //   ) : null
      // }
      bottomRight={
        dashboard ? (
          <BranchHeadcountGapChart
            data={
              dashboard.charts.branchWorkforceForecast ??
              dashboard.charts.branchGapBar
            }
          />
        ) : null
      }
      footerLeft={
        dashboard ? <OvertimeRiskChart data={dashboard.charts.overtimeRisk} /> : null
      }
      footerRight={
        dashboard ? (
          <GeographyWorkforceChart data={dashboard.charts.geographyWorkforce} />
        ) : null
      }
      table={
        dashboard ? (
          <>
            <TechnicianDemandTable rows={dashboard.table.rows} />
            <HiringPipelineTable rows={dashboard.hiringPipeline} />
          </>
        ) : null
      }
    />
  );
}

import useTechnicianDemand from "./hooks/useTechnicianDemand";
import DashboardLayout from "../../components/Common/DashboardLayout";
import KpiCard from "../../components/Common/KpiCard";
import SkillDemandChart from "./components/SkillDemandChart";
import WorkforcePlanning from "./components/WorkforcePlanning";
import TechnicianDemandTable from "./components/TechnicianDemandTable";
import HeadcountTrendChart from "./components/HeadcountTrendChart";
import BranchGapChart from "./components/BranchGapChart";

export default function TechnicianDemand() {
  const { dashboard, loading, error } = useTechnicianDemand();

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error loading dashboard.</div>;

  console.log("Dashboard", dashboard);
  console.log("Planning", dashboard.planning);

  return (
    <DashboardLayout
      loading={loading}
      error={error}
      kpis={
        <div className="kpiSection">
          {dashboard.kpis.map((item) => (
            <KpiCard
              key={item.title}
              title={item.title}
              value={item.value}
              subText={item.subText}
              positive={item.positive}
              alert={item.alert}
            />
          ))}
        </div>
      }
      topLeft={<SkillDemandChart data={dashboard.charts.skill} />}
      middleLeft={
        <HeadcountTrendChart data={dashboard.charts.headcountTrend} />
      }
      middleRight={
        <BranchGapChart
          data={dashboard.charts.branchGap}
          summary={dashboard.branchGapSummary}
        />
      }
      topRight={<WorkforcePlanning planning={dashboard.planning} />}
      table={<TechnicianDemandTable rows={dashboard.table.rows} />}
    />
  );
}

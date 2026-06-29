import useTechnicianDemand from "../hooks/useTechnicianDemand";

import DashboardLayout from "../components/Dashboard/DashboardLayout";

import KpiCard from "../components/KPI/KpiCard";

import SkillDemandChart from "../components/TechnicianDemand/SkillDemandChart";

import WorkforcePlanning from "../components/TechnicianDemand/WorkforcePlanning";

import TechnicianDemandTable from "../components/TechnicianDemand/TechnicianDemandTable";

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
      topRight={<WorkforcePlanning planning={dashboard.planning} />}
      table={<TechnicianDemandTable rows={dashboard.table.rows} />}
    />
  );
}

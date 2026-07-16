import { filterRowsByBranch, isAllBranches } from "../../../utils/branchFilters";

const horizonKey = (forecastDays) => `${forecastDays}d`;

export const mapBranchLoadData = (
  response,
  forecastDays = 30,
  branchId = "ALL",
) => {
  if (!response) return null;

  const {
    metadata,
    summary,
    graph_data,
    branch_load_table,
    load_alerts,
    rebalancing_recommendations,
    filter_definitions,
  } = response;

  const horizon = horizonKey(forecastDays);

  const kpis = [
    {
      title: "Average Predicted Load",
      value: `${summary[`avg_load_pct_${horizon}`] ?? 0}%`,
      positive: true,
      alert: false,
    },
    {
      title: "Capacity Breach Alerts",
      value: summary[`branches_over_capacity_${horizon}`] ?? 0,
      subText: "Branches Over Capacity",
      positive: false,
      alert: (summary[`branches_over_capacity_${horizon}`] ?? 0) > 0,
    },
    {
      title: "Total Branches",
      value: summary.total_branches ?? 0,
      positive: true,
      alert: false,
    },
    {
      title: "High Load Branches",
      value: summary[`branches_high_load_${horizon}`] ?? 0,
      subText: `${summary[`branches_medium_load_${horizon}`] ?? 0} Medium Load`,
      positive: false,
      alert: (summary[`branches_high_load_${horizon}`] ?? 0) > 0,
    },
    {
      title: "Peak Load",
      value: `${summary[`peak_load_pct_${horizon}`] ?? 0}%`,
      subText: summary[`peak_load_branch_id_${horizon}`] ?? "",
      positive: false,
      alert: false,
    },
  ];

  const scopedBranchRows = isAllBranches(branchId)
    ? graph_data?.branch_load_bar || []
    : filterRowsByBranch(graph_data?.branch_load_bar || [], branchId);

  const branchRows = scopedBranchRows.length
    ? scopedBranchRows
    : graph_data?.branch_load_bar || [];

  const gaugeChart = branchRows.map((item) => ({
    id: item.branch_id,
    branch: item.branch_name,
    geography: item.geography_zone,
    load: Number(item[`combined_load_pct_${horizon}`] ?? 0),
    jobs: item[`predicted_jobs_${horizon}`] ?? 0,
    capacity: item.available_bays,
    breach: item[`load_status_${horizon}`] === "CRITICAL",
  }));

  const trend = graph_data?.load_forecast_timeseries || [];

  const trendChart = {
    labels: trend.map((item) =>
      new Date(item.period_date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
    ),
    datasets: [
      {
        label: "Forecast",
        data: trend.map((item) => Number(item.max_load_pct?.toFixed(1) ?? 0)),
        borderColor: "#f5b400",
        backgroundColor: "#f5b400",
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 4,
      },
      {
        label: "Actual",
        data: trend.map((item) => Number(item.avg_load_pct?.toFixed(1) ?? 0)),
        borderColor: "#37d8c3",
        backgroundColor: "#37d8c3",
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 4,
      },
    ],
  };

  const tableBuckets = branch_load_table || {};
  const allRows = ["CRITICAL", "HIGH", "MEDIUM", "LOW"].flatMap(
    (key) => tableBuckets[key] || [],
  );

  const scopedTableRows = isAllBranches(branchId)
    ? allRows
    : filterRowsByBranch(allRows, branchId);

  const rows = (scopedTableRows.length ? scopedTableRows : allRows).map((row) => ({
    id: row.prediction_id,
    branch: row.branch_name,
    geography: row.geography_zone,
    period: `${row.forecast_horizon_days} Days`,
    predictedLoad: Number(row.load_pct ?? 0),
    capacityGap: row.capacity_gap_bays,
    breach: row.load_status === "CRITICAL",
    bindingConstraint: row.binding_constraint,
    actions: {
      canReallocate: row.actions?.can_trigger_redeployment ?? false,
      canView: row.actions?.can_view_detail ?? false,
    },
  }));

  return {
    metadata,
    summary,
    filters: filter_definitions,
    alerts: load_alerts,
    recommendations: rebalancing_recommendations,
    kpis,
    charts: {
      gauge: gaugeChart,
      trend: trendChart,
    },
    table: {
      rows,
      totalRows: rows.length,
    },
  };
};

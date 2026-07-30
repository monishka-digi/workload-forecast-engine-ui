import {
  filterRowsByBranch,
  formatBranchLabel,
  isAllBranches,
} from "../../../utils/branchFilters";

const horizonKey = (forecastDays) => `${Number(forecastDays) || 30}d`;

const pickHorizonValue = (source = {}, baseKey, horizon, fallback = 0) =>
  source?.[`${baseKey}_${horizon}`] ??
  source?.[baseKey] ??
  source?.[`${baseKey}_30d`] ??
  fallback;

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
  const currentHorizon = Number(forecastDays) || 30;

  const kpis = [
    {
      title: `Average Predicted Load (${currentHorizon}D)`,
      value: `${pickHorizonValue(summary, "avg_load_pct", horizon, 0)}%`,
      positive: true,
      alert: false,
    },
    {
      title: `Capacity Breach Alerts (${currentHorizon}D)`,
      value: pickHorizonValue(summary, "branches_over_capacity", horizon, 0),
      subText: "Branches Over Capacity",
      positive: false,
      alert: pickHorizonValue(summary, "branches_over_capacity", horizon, 0) > 0,
    },
    {
      title: "Total Branches",
      value: summary.total_branches ?? 0,
      positive: true,
      alert: false,
    },
    {
      title: `High Load Branches (${currentHorizon}D)`,
      value: pickHorizonValue(summary, "branches_high_load", horizon, 0),
      subText: `${pickHorizonValue(summary, "branches_medium_load", horizon, 0)} Medium Load`,
      positive: false,
      alert: pickHorizonValue(summary, "branches_high_load", horizon, 0) > 0,
    },
    {
      title: `Peak Load (${currentHorizon}D)`,
      value: `${pickHorizonValue(summary, "peak_load_pct", horizon, 0)}%`,
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
    branch_id: item.branch_id,
    branch_name: item.branch_name,
    branch: formatBranchLabel(item.branch_name),
    geography: item.geography_zone,
    load: Number(item[`combined_load_pct_${horizon}`] ?? item.combined_load_pct ?? 0),
    jobs: item[`predicted_jobs_${horizon}`] ?? item.predicted_jobs_30d ?? 0,
    capacity: item.available_bays,
    breach: item[`load_status_${horizon}`] === "CRITICAL",
  }));

  const capacityTrend = graph_data?.capacity_vs_demand_trend || graph_data?.load_forecast_timeseries || [];
  const firstForecastIndex = capacityTrend.findIndex((row) => row.is_forecast);

  const trendChart = {
    labels: capacityTrend.map((item) =>
      new Date(item.period_date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
    ),
    periodDates: capacityTrend.map((item) => item.period_date),
    rawRows: capacityTrend,
    firstForecastIndex,
    datasets: [
      {
        label: "Capacity",
        data: capacityTrend.map((item) => Number(item.capacity_hours ?? 0)),
        borderColor: "#2a78d6",
        backgroundColor: "rgba(42,120,214,0.12)",
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 0,
        fill: true,
      },
      {
        label: "Demand (actual)",
        data: capacityTrend.map((item, index) =>
          firstForecastIndex === -1 || index <= firstForecastIndex ? Number(item.required_hours ?? 0) : null,
        ),
        borderColor: "#eb6834",
        backgroundColor: "#eb6834",
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 3,
        fill: false,
      },
      {
        label: "Demand (forecast)",
        data: capacityTrend.map((item, index) =>
          firstForecastIndex === -1 || index >= firstForecastIndex ? Number(item.required_hours ?? 0) : null,
        ),
        borderColor: "#eb6834",
        backgroundColor: "#eb6834",
        tension: 0.3,
        borderWidth: 2,
        borderDash: [6, 4],
        pointStyle: "triangle",
        pointRadius: 3,
        fill: false,
      },
    ],
  };

  const tableBuckets = branch_load_table || {};
  const allRows = ["CRITICAL", "HIGH", "MEDIUM", "LOW"].flatMap(
    (key) => tableBuckets[key] || [],
  );

  const horizonRows = allRows.filter(
    (row) => Number(row.forecast_horizon_days ?? currentHorizon) === currentHorizon,
  );

  const scopedTableRows = isAllBranches(branchId)
    ? horizonRows
    : filterRowsByBranch(horizonRows, branchId);

  const rows = (scopedTableRows.length ? scopedTableRows : horizonRows.length ? horizonRows : allRows).map(
      (row) => ({
      id: row.prediction_id,
      branch: formatBranchLabel(row.branch_name),
      geography: row.geography_zone,
      period: `${row.forecast_horizon_days ?? currentHorizon} Days`,
      predictedLoad: Number(
        row[`load_pct_${horizon}`] ?? row.load_pct ?? 0,
      ),
      capacityGap:
        row[`capacity_gap_bays_${horizon}`] ?? row.capacity_gap_bays,
      breach:
        (row[`load_status_${horizon}`] ?? row.load_status) === "CRITICAL",
      bindingConstraint:
        row[`binding_constraint_${horizon}`] ?? row.binding_constraint,
      actions: {
        canReallocate: row.actions?.can_trigger_redeployment ?? false,
        canView: row.actions?.can_view_detail ?? false,
      },
    }),
  );

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

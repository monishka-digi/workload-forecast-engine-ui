import { machineColors } from "../../../config/chartColors";
import {
  filterRowsByBranch,
  formatBranchLabel,
  isAllBranches,
} from "../../../utils/branchFilters";

const getHorizonSuffix = (forecastDays = 30) => `${Number(forecastDays) || 30}d`;

const pickHorizonValue = (row, baseKey, horizonSuffix) =>
  row?.[`${baseKey}_${horizonSuffix}`] ??
  row?.[baseKey] ??
  row?.[`${baseKey}_30d`] ??
  0;

const getLoadStatusColor = (status) => {
  switch (String(status || "").toUpperCase()) {
    case "CRITICAL":
      return "#ef5a5a";
    case "HIGH":
      return "#f59e0b";
    case "MEDIUM":
      return "#4b8df8";
    case "LOW":
      return "#34d6b8";
    default:
      return "#f5b400";
  }
};

export const mapJobVolumeData = (
  response,
  forecastDays = 30,
  branchId = "ALL",
) => {
  if (!response) return null;

  /* -------------------------------------------------------------------------- */
  /*                                  ROOT DATA                                 */
  /* -------------------------------------------------------------------------- */

  const {
    summary,
    metadata,
    alerts,
    filter_definitions,
    graph_data,
    forecast_table,
    model_performance,
    top_branches_by_demand,
  } = response;

  const horizonSuffix = getHorizonSuffix(forecastDays);

  const trend = graph_data?.forecast_trend_line || [];
  const machine = graph_data?.machine_type_demand_bar || [];
  const branches = graph_data?.jobs_by_branch_bar || [];
  const jobTypeDonut = graph_data?.job_type_distribution_donut || [];
  const horizonComparison = graph_data?.horizon_comparison_bar || [];
  const geographyHeatmap = graph_data?.geography_heatmap || [];
  const monsoonOverlay = graph_data?.monsoon_impact_overlay || [];
  const forecastVsActual = graph_data?.forecast_vs_actual_accuracy || [];
  const branchJobsKey = `predicted_jobs_${horizonSuffix}`;
  const actualJobCountTotal = trend.reduce(
    (sum, item) => sum + Number(item.actual_job_count ?? 0),
    0,
  );

  // Flatten all priority buckets from forecast_table into a single array
  const tableRows = Object.values(forecast_table || {}).flat();

  /* -------------------------------------------------------------------------- */
  /*                               CALCULATED DATA                              */
  /* -------------------------------------------------------------------------- */

  const scopedMachine = isAllBranches(branchId)
    ? machine
    : filterRowsByBranch(machine, branchId);
  const machineScope = scopedMachine.length ? scopedMachine : machine;

  const machineTotal = machineScope.reduce(
    (sum, item) => sum + Number(item.value || 0),
    0
  );

  const averageLoad =
    branches.length > 0
      ? Math.round(
          branches.reduce(
            (sum, branch) => sum + Number(branch.load_pct || 0),
            0
          ) / branches.length
        )
      : 0;

  /* -------------------------------------------------------------------------- */
  /*                                   KPI DATA                                 */
  /* -------------------------------------------------------------------------- */

  const kpis = [
    {
      id: "predicted_jobs",
      title: `Predicted Jobs (${forecastDays}D)`,
      value: summary[`total_predicted_jobs_${horizonSuffix}`] ?? summary.total_predicted_jobs_30d,
      alert: false,
    },

    {
      id: `avg_daily_jobs_${horizonSuffix}`,
      title: `Avg Daily Jobs (${forecastDays}D)`,
      value: Math.ceil(
        Number(
          summary[`avg_daily_jobs_${horizonSuffix}`] ??
            summary.avg_daily_jobs_30d ??
            0,
        ),
      ),
      positive: summary.forecast_accuracy_pct >= 90,
      alert: false,
    },

    {
      id: "total_branches_forecasted",
      title: "Total Branches",
      value: summary.total_branches_forecasted,
      positive: true,
      alert: false,
    },

    {
      id: "critical_branches",
      title: "Critical Branches",
      value: summary.branches_at_critical_load,
      subText: `${summary.branches_at_high_load} High Load`,
      positive: false,
      alert: summary.branches_at_critical_load > 0,
    },

    {
      id: "actual_jobs",
      title: `Actual Jobs (${forecastDays}D)`,
      value: actualJobCountTotal,
      subText: "From forecast trend line",
      positive: true,
      alert: false,
    },
  ];

  /* -------------------------------------------------------------------------- */
  /*                              FORECAST CHART                                */
  /* -------------------------------------------------------------------------- */

  const forecastChart = {
    labels: trend.map((item) =>
      new Date(item.period_date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      })
    ),
    periodDates: trend.map((item) => item.period_date),

    datasets: [
      {
        label: "Forecast",
        data: trend.map((item) => item.predicted_job_count),
        borderColor: "#f5b400",
        backgroundColor: "rgba(245,180,0,0.15)",
        borderWidth: 3,
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.4,
        fill: false,
      },

      {
        label: "Actual",
        data: trend.map((item) => item.actual_job_count),
        borderColor: "#34d6b8",
        backgroundColor: "#34d6b8",
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: false,
      },
    ],
  };

  /* -------------------------------------------------------------------------- */
  /*                            MACHINE MIX CHART                               */
  /* -------------------------------------------------------------------------- */

  const machineMix = {
    total: machineTotal,
    labels: machineScope.map((item) => item.label),
    ...(machineScope.some((item) => item.branch_id)
      ? { branchIds: machineScope.map((item) => item.branch_id) }
      : {}),
    datasets: [
      {
        data: machineScope.map((item) => item.value),
        backgroundColor: machineColors,
        borderColor: "#ffffff",
        borderWidth: 1,
        spacing: 2,
        hoverOffset: 6,
        radius: "80%",
      },
    ],
  };

  /* -------------------------------------------------------------------------- */
  /*                              BRANCH CHART                                  */
  /* Filter by branch, but render the dominant job type on the Job Volume page. */
  /* -------------------------------------------------------------------------- */

  const selectedBranches = isAllBranches(branchId)
    ? branches
    : filterRowsByBranch(branches, branchId);

  const branchScope = selectedBranches.length ? selectedBranches : branches;
  const sortedBranchScope = [...branchScope].sort(
    (a, b) =>
      Number(b[branchJobsKey] ?? b.predicted_jobs_30d ?? 0) -
      Number(a[branchJobsKey] ?? a.predicted_jobs_30d ?? 0),
  );

  const branchChart = {
    labels: sortedBranchScope.map(
      (item) => item.dominant_job_type || "Unspecified",
    ),
    branchIds: sortedBranchScope.map((item) => item.branch_id),
    details: sortedBranchScope.map((item) => ({
      branchName: formatBranchLabel(item.branch_name),
      dominantJobType: item.dominant_job_type || "Unspecified",
      predictedJobs: Number(
        item[branchJobsKey] ?? item.predicted_jobs_30d ?? 0,
      ),
      confidence:
        item.confidence_pct ??
        item.prediction_confidence_pct ??
        item.confidence ??
        item.prediction_confidence,
      load: item.load_pct,
      loadStatus: item.load_status,
      capacity: item.capacity_rating,
    })),
    datasets: [
      {
        label: "Predicted Jobs",
        data: sortedBranchScope.map(
          (item) =>
            Math.ceil(
              Number(item[branchJobsKey] ?? item.predicted_jobs_30d ?? 0),
            ),
        ),
        backgroundColor: sortedBranchScope.map((item) =>
          getLoadStatusColor(item.load_status),
        ),
        borderRadius: 8,
        borderSkipped: false,
        maxBarThickness: 24,
      },
    ],
  };

  /* -------------------------------------------------------------------------- */
  /*                    JOB NAME CHART (for Job Volume page)                    */
  /*  Shows job names on y-axis, grouped by job type, filtered by branch        */
  /*  Data is still filtered by branchScope and respects forecasting days       */
  /* -------------------------------------------------------------------------- */

  const jobNameAggregation = branchScope.reduce((acc, branch) => {
    const jobName = branch.dominant_job_type || "Unspecified";
    const value = Number(branch[branchJobsKey] ?? branch.predicted_jobs_30d ?? 0);

    if (!acc[jobName]) {
      acc[jobName] = { total: 0, branchIds: [] };
    }
    acc[jobName].total += value;
    acc[jobName].branchIds.push(branch.branch_id);

    return acc;
  }, {});

  const sortedJobNames = Object.entries(jobNameAggregation).sort(
    (a, b) => b[1].total - a[1].total
  );

  const jobNameChart = {
    labels: sortedJobNames.map(([jobName]) => jobName),
    branchIds: sortedJobNames.map(([, agg]) => agg.branchIds),
    datasets: [
      {
        label: "Predicted Jobs",
        data: sortedJobNames.map(([, agg]) => Math.ceil(agg.total)),
        backgroundColor: "#f5b400",
        borderRadius: 8,
        borderSkipped: false,
        maxBarThickness: 24,
      },
    ],
  };

  // Keep jobTypeChart for backwards compatibility
  const jobTypeChart = jobNameChart;

  /* -------------------------------------------------------------------------- */
  /*                             CAPACITY PRESSURE                              */
  /* -------------------------------------------------------------------------- */

  const capacity = branchScope.map((branch) => ({
    id: branch.branch_id,
    branch: formatBranchLabel(branch.branch_name),
    jobs: branch[branchJobsKey] ?? branch.predicted_jobs_30d ?? 0,
    load: branch.load_pct,
    rating: branch.capacity_rating,
    // capacity_breach_flag is not on branch-level data; derive from load_pct
    breach: branch.load_pct >= 100,
    color:
      branch.load_pct >= 100
        ? "var(--danger)"
        : branch.load_pct >= 90
        ? "var(--warning)"
        : "var(--primary)",
  }));

  /* -------------------------------------------------------------------------- */
  /*                             PREDICTION TABLE                               */
  /* -------------------------------------------------------------------------- */

  const selectedRows = isAllBranches(branchId)
    ? tableRows
    : filterRowsByBranch(tableRows, branchId);

  const predictionTable = (selectedRows.length ? selectedRows : tableRows).map((row) => ({
    id: row.prediction_id,
    branch: formatBranchLabel(row.branch_name),
    branchId: row.branch_id,
    geography: row.geography_zone,
    period: row.period_date,
    horizon: row.forecast_horizon_days,

    // Core forecast values
    predictedJobs: pickHorizonValue(row, "predicted_job_count", horizonSuffix),
    predictedJobs60d: row.predicted_job_count_60d,
    predictedJobs90d: row.predicted_job_count_90d,
    forecastLabel: `Forecast (${forecastDays}D)`,
    lower: row.predicted_job_count_p10,
    upper: row.predicted_job_count_p90,

    // Confidence
    confidence: Math.round((row.prediction_confidence ?? 0) * 100),
    confidenceLabel:
      row.prediction_confidence_pct ??
      `${Math.round((row.prediction_confidence ?? 0) * 100)}%`,

    // Load info
    loadStatus: row.load_status,
    loadPercentage: row.load_pct,
    capacity: row.branch_capacity_rating,
    capacityBreach: row.capacity_breach_flag,

    // Actions
    actions: row.actions,
  }));

  /* -------------------------------------------------------------------------- */
  /*                               FINAL OBJECT                                 */
  /* -------------------------------------------------------------------------- */

  return {
    metadata,
    summary,
    alerts,
    filters: filter_definitions,
    kpis,
    modelPerformance: model_performance,
    topBranches: (top_branches_by_demand || []).map((item) => ({
      ...item,
      branch_name: formatBranchLabel(item.branch_name),
    })),

    charts: {
      forecast: forecastChart,
      machineMix,
      branch: branchChart,
      jobType: jobTypeChart,
      capacity,

      // Additional graph data passed through for future use
      jobTypeDonut,
      horizonComparison,
      geographyHeatmap,
      monsoonOverlay,
      forecastVsActual,
    },

    table: {
      rows: predictionTable,
      totalRows: predictionTable.length,
    },

    statistics: {
      totalBranchJobs: branchScope.reduce(
        (sum, item) => sum + Number(item[branchJobsKey] ?? item.predicted_jobs_30d ?? 0),
        0
      ),
      averageLoad:
        branchScope.length > 0
          ? Math.round(
              branchScope.reduce(
                (sum, branch) => sum + Number(branch.load_pct || 0),
                0
              ) / branchScope.length
            )
          : 0,
      totalMachineDemand: machineTotal,
    },
  };
};

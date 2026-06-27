// src/utils/jobVolumeMapper.js

import { machineColors } from "../config/chartColors";

export const mapJobVolumeData = (response) => {
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
  } = response;

  const trend = graph_data.forecast_trend_line || [];

  const machine = graph_data.machine_type_demand_bar || [];

  const branches = graph_data.jobs_by_branch_bar || [];

  const tableRows = Object.values(forecast_table || {}).flat();

  /* -------------------------------------------------------------------------- */
  /*                               CALCULATED DATA                              */
  /* -------------------------------------------------------------------------- */

  const machineTotal = machine.reduce(
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

  const totalBranchJobs = branches.reduce(
    (sum, item) => sum + Number(item.predicted_jobs_30d || 0),
    0
  );

    /* -------------------------------------------------------------------------- */
  /*                                   KPI DATA                                 */
  /* -------------------------------------------------------------------------- */

  const kpis = [
    {
      id: "predicted_jobs",
      title: "Predicted Jobs (30D)",
      value: summary.total_predicted_jobs_30d,
      subText: `${summary.yoy_growth_pct}% YoY`,
      positive: summary.yoy_growth_pct >= 0,
      alert: false,
    },

    {
      id: "forecast_accuracy",
      title: "Forecast Accuracy",
      value: `${summary.forecast_accuracy_pct}%`,
      subText: `MAPE ${summary.mape_last_30d}%`,
      positive: summary.forecast_accuracy_pct >= 90,
      alert: false,
    },

    {
      id: "confidence",
      title: "Model Confidence",
      value: `${summary.model_confidence_avg_pct}%`,
      subText: summary.confidence_level,
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
      id: "capacity_ratio",
      title: "Jobs / Capacity",
      value: summary.jobs_vs_capacity_ratio,
      subText: `Avg Load ${averageLoad}%`,
      positive: averageLoad < 85,
      alert: averageLoad >= 95,
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

    labels: machine.map((item) => item.label),

    datasets: [
      {
        data: machine.map((item) => item.value),

        backgroundColor: machineColors,

        borderColor: "#171c24",

        borderWidth: 2,

        hoverOffset: 10,
      },
    ],
  };
    /* -------------------------------------------------------------------------- */
  /*                              BRANCH CHART                                  */
  /* -------------------------------------------------------------------------- */

  const branchChart = {
    labels: branches.map((item) => item.branch_name),

    datasets: [
      {
        label: "Predicted Jobs",

        data: branches.map((item) => item.predicted_jobs_30d),

        backgroundColor: "#f5b400",

        borderRadius: 8,

        borderSkipped: false,

        barThickness: 18,
      },
    ],
  };

  /* -------------------------------------------------------------------------- */
  /*                             CAPACITY PRESSURE                              */
  /* -------------------------------------------------------------------------- */

  const capacity = branches.map((branch) => ({

    id: branch.branch_id,

    branch: branch.branch_name,

    jobs: branch.predicted_jobs_30d,

    load: branch.load_pct,

    rating: branch.capacity_rating,

    breach: branch.capacity_breach_flag,

    color:
      branch.load_pct >= 100
        ? "#ef4444"
        : branch.load_pct >= 90
        ? "#f59e0b"
        : "#34d399",

  }));

  /* -------------------------------------------------------------------------- */
  /*                             PREDICTION TABLE                               */
  /* -------------------------------------------------------------------------- */

  const predictionTable = tableRows.map((row) => ({

    id: row.prediction_id,

    branch: row.branch_name,

    branchId: row.branch_id,

    geography: row.geography_zone,

    machine: row.machine_type,

    segment: row.customer_segment,

    period: row.period_date,

    horizon: row.forecast_horizon_days,

    predictedJobs: row.predicted_job_count,

    lower: row.predicted_job_count_p10,

    upper: row.predicted_job_count_p90,

    confidence:

      Math.round((row.prediction_confidence ?? 0) * 100),

    confidenceLabel:

      row.prediction_confidence_pct ??

      `${Math.round((row.prediction_confidence ?? 0) * 100)}%`,

    loadStatus: row.load_status,

    loadPercentage: row.load_pct,

    capacity: row.branch_capacity_rating,

    capacityBreach: row.capacity_breach_flag,

    amcDue: row.amc_due_count_30d,

    monsoon: row.is_monsoon_season,

    repeatBreakdownRate: row.repeat_breakdown_rate_30d,

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

    charts: {

      forecast: forecastChart,

      machineMix,

      branch: branchChart,

      capacity,

    },

    table: {

      rows: predictionTable,

      totalRows: predictionTable.length,

    },

    statistics: {

      totalBranchJobs,

      averageLoad,

      totalMachineDemand: machineTotal,

    },

  };

};
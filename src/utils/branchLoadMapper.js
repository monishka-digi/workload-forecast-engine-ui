export const mapBranchLoadData = (response) => {
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

  // ---------------- KPIs ----------------

  const kpis = [
    {
      title: "Average Predicted Load",
      value: summary.avg_load_display,
      subText: `${summary.active_branches} Active Branches`,
      positive: true,
      alert: false,
    },

    {
      title: "Branches Over Capacity",
      value: summary.branches_over_capacity,
      subText: "Capacity Breach",
      positive: false,
      alert: true,
    },

    {
      title: "Branches Covered",
      value: summary.total_branches,
      subText: "Forecast Generated",
      positive: true,
      alert: false,
    },

    {
      title: "Capacity Gap",
      value: summary.total_predicted_capacity_gap_jobs,
      subText: "Jobs",
      positive: false,
      alert: false,
    },

    {
      title: "Avg SLA",
      value: summary.avg_sla_compliance_display,
      subText: `${summary.avg_tat_days} Days TAT`,
      positive: true,
      alert: false,
    },
  ];

  // ---------------- Gauge Chart ----------------

  const gaugeChart = (graph_data?.branch_load_bar_30d || []).map((item) => ({
    id: item.branch_id,

    branch: item.branch_name,

    geography: item.geography_zone,

    load: Number((item.predicted_load_pct * 100).toFixed(1)),

    display: item.predicted_load_display,

    jobs: item.predicted_job_volume,

    capacity: item.branch_capacity_rating,

    breach: item.capacity_breach_flag,
  }));

  // ---------------- Trend Chart ----------------

  const trend = graph_data?.load_forecast_timeseries || [];

  const trendChart = {
  labels: trend.map(item =>
    new Date(item.period_date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
      }
    )
  ),

  datasets: [
    {
      label: "Forecast",

      data: trend.map(item =>
        Number((item.max_load_pct * 100).toFixed(1))
      ),

      borderColor: "#f5b400",

      backgroundColor: "#f5b400",

      tension: 0.4,

      borderWidth: 3,

      pointRadius: 4,
    },

    {
      label: "Actual",

      data: trend.map(item =>
        Number((item.avg_load_pct * 100).toFixed(1))
      ),

      borderColor: "#37d8c3",

      backgroundColor: "#37d8c3",

      tension: 0.4,

      borderWidth: 3,

      pointRadius: 4,
    },
  ],
};

  // ---------------- Table ----------------

  const rows = (branch_load_table?.all_branches || []).map((row) => ({
  id: row.prediction_id,

  branch: row.branch_name,

  geography: row.geography_zone,

  period: row.period_date,

  predictedLoad: Number((row.predicted_load_pct * 100).toFixed(1)),

  lower: Number((row.predicted_load_pct_p10 * 100).toFixed(1)),

  upper: Number((row.predicted_load_pct_p90 * 100).toFixed(1)),

  capacityGap: row.predicted_capacity_gap,

  breach: row.capacity_breach_flag,

  actions: {
    canReallocate: row.actions?.can_reallocate ?? true,
    canView: row.actions?.can_view ?? true,
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

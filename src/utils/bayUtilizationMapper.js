export const mapBayUtilizationData = (response) => {
  if (!response) return null;

  const { metadata, summary, graph_data, forecast_table, filter_definitions } =
    response;

  // ---------------- KPIs ----------------

  const kpis = [
    {
      title: "Avg Predicted Util.",
      value: `${summary.avg_utilization_pct_30d}%`,
      subText: `${summary.avg_utilization_pct_60d}% (60 Days)`,
      positive: true,
      alert: false,
    },

    {
      title: "Bay Types Near Capacity",
      value: summary.near_capacity_bays_30d,
      subText: ">90% threshold",
      positive: false,
      alert: true,
    },

    {
      title: "Bay Types Tracked",
      value: filter_definitions.bay_type_options.length - 1,
      subText: filter_definitions.bay_type_options
        .slice(1)
        .map((x) => x.label)
        .join(" / "),
      positive: true,
      alert: false,
    },

    {
      title: "Branches With Alert",
      value: summary.branches_with_bay_overload,
      subText: "Near Capacity",
      positive: false,
      alert: false,
    },

    {
      title: "Most Loaded Type",
      value: summary.bay_type_highest_utilization,
      subText: `${summary.peak_utilization_pct}%`,
      positive: true,
      alert: false,
    },
  ];

  // ---------------- Left Progress Chart ----------------

  const utilizationChart = (graph_data?.bay_type_utilization_bar || []).map(
    (item) => ({
      label: item.label,
      value: item.avg_utilization_30d,
      nearCapacityDays: item.near_capacity_days,
      overflowRisk: item.overflow_risk_score,
      bayCount: item.bay_count,
    }),
  );

  // ---------------- Heatmap ----------------

  const grouped = {};

  (graph_data?.branch_bay_heatmap || []).forEach((item) => {
    const key = item.branch_id;

    if (!grouped[key]) {
      grouped[key] = {
        branch: item.branch_name,
      };
    }

    grouped[key][item.bay_type] = item.avg_util_30d;
  });

  const heatmap = Object.values(grouped);

  // ---------------- Table ----------------

  const rows = Object.values(forecast_table || {})
    .flat()
    .map((row) => ({
      id: row.prediction_id,

      branch: row.branch_id,

      bayType: row.bay_type,

      period: row.period_date,

      utilization:
        row.predicted_utilization_pct > 1
          ? Number(row.predicted_utilization_pct.toFixed(1))
          : Number((row.predicted_utilization_pct * 100).toFixed(1)),

      lower:
        row.predicted_utilization_pct_p10 > 1
          ? Number(row.predicted_utilization_pct_p10.toFixed(1))
          : Number((row.predicted_utilization_pct_p10 * 100).toFixed(1)),

      upper:
        row.predicted_utilization_pct_p90 > 1
          ? Number(row.predicted_utilization_pct_p90.toFixed(1))
          : Number((row.predicted_utilization_pct_p90 * 100).toFixed(1)),

      nearCapacity: row.near_capacity_flag,

      overflowRisk: row.overflow_risk_pct,

      jobs: row.jobs_scheduled,

      actions: {
        can_reallocate: row.actions?.can_reallocate ?? true,
        can_view: row.actions?.can_view ?? true,
      },
    }));

  return {
    metadata,

    summary,

    filters: filter_definitions,

    kpis,

    charts: {
      utilization: utilizationChart,
      heatmap,
    },

    table: {
      rows,
      totalRows: rows.length,
    },
  };
};

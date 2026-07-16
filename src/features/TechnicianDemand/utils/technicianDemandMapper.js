import {
  filterRowsByBranch,
  formatBranchLabel,
  isAllBranches,
} from "../../../utils/branchFilters";

const pick = (...values) =>
  values.find((value) => value !== undefined && value !== null);

const toNumber = (value) => Number(value ?? 0);

const formatPercent = (value) => `${toNumber(value).toFixed(1)}%`;

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

const buildLineChart = (rows = []) => ({
  labels: rows.map((item) =>
    new Date(item.period_date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    }),
  ),
  datasets: [
    {
      label: "Required",
      data: rows.map((item) => toNumber(item.required)),
      borderColor: "#f5b400",
      backgroundColor: "rgba(245,180,0,0.10)",
      fill: true,
      tension: 0.3,
      borderWidth: 2,
      pointRadius: 3,
      pointBackgroundColor: "#f5b400",
    },
    {
      label: "Available",
      data: rows.map((item) => toNumber(item.available)),
      borderColor: "#12BE83",
      backgroundColor: "transparent",
      fill: false,
      tension: 0.3,
      borderWidth: 2,
      pointRadius: 3,
      pointBackgroundColor: "#12BE83",
    },
  ],
});

const buildSkillChart = (rows = []) => ({
  labels: rows.map((item) => item.skill_level),
  datasets: [
    {
      label: "Required (30D)",
      data: rows.map((item) => toNumber(item.required_30d)),
      backgroundColor: "#f5b400",
      borderRadius: 6,
      maxBarThickness: 24,
    },
    {
      label: "Available",
      data: rows.map((item) => toNumber(item.available)),
      backgroundColor: "#12BE83",
      borderRadius: 6,
      maxBarThickness: 24,
    },
  ],
});

const buildBranchGapChart = (rows = []) => ({
  labels: rows.map((item) => formatBranchLabel(item.branch_name)),
  branchIds: rows.map((item) => item.branch_id),
  datasets: [
    {
      label: "Required (30D)",
      data: rows.map((item) => toNumber(item.required_30d)),
      backgroundColor: "#f5b400",
      borderRadius: 6,
      maxBarThickness: 24,
    },
    {
      label: "Available",
      data: rows.map((item) => toNumber(item.available)),
      backgroundColor: "#12BE83",
      borderRadius: 6,
      maxBarThickness: 24,
    },
  ],
});

const buildHeatmapMatrix = (rows = []) => {
  const skillLevels = Array.from(
    new Set(
      rows.flatMap((row) =>
        Object.keys(row).filter((key) => key !== "job_type"),
      ),
    ),
  );

  const heatmapRows = rows.map((row) => ({
    jobType: row.job_type,
    values: skillLevels.map((skillLevel) => toNumber(row[skillLevel])),
  }));

  const maxValue = Math.max(
    0,
    ...heatmapRows.flatMap((row) => row.values),
  );

  return {
    rowLabels: heatmapRows.map((row) => row.jobType),
    columnLabels: skillLevels,
    rows: heatmapRows,
    maxValue,
  };
};

export const mapTechnicianDemandData = (
  response,
  forecastDays = 30,
  branchId = "ALL",
) => {
  if (!response) return null;

  const {
    metadata = {},
    summary = {},
    graph_data = {},
    forecast_table = {},
    redeployment_recommendations = [],
    hiring_pipeline = [],
    filter_definitions = {},
    applied_filters = {},
    model_performance = {},
  } = response;

  const skillRows = graph_data.skill_mix_required_vs_available_bar || [];
  const trendRows = graph_data.headcount_requirement_trend || [];
  const gapRows = graph_data.branch_headcount_gap_bar || [];
  const heatmapRows = graph_data.skill_demand_by_job_type_stacked || [];
  const overtimeRows = graph_data.overtime_risk_line || [];
  const tableRows = Object.values(forecast_table || {}).flat();

  const currentHorizon = Number(
    applied_filters.forecast_horizon_days ??
      metadata.forecast_horizons?.[0] ??
      forecastDays,
  );

  const skillLevelLabels = (filter_definitions.skill_level_options || [])
    .filter((option) => option.value !== "ALL")
    .map((option) => option.label)
    .join(" / ");

  const topRedeployment = [...redeployment_recommendations].sort(
    (left, right) =>
      toNumber(
        right.recommended_headcount ??
          right.technicians_to_move ??
          right.recommended_move_count,
      ) -
      toNumber(
        left.recommended_headcount ??
          left.technicians_to_move ??
          left.recommended_move_count,
      ),
  )[0];

  const topHiring = [...hiring_pipeline].sort(
    (left, right) => toNumber(right.shortfall_30d) - toNumber(left.shortfall_30d),
  )[0];

  const secondHiring = [...hiring_pipeline].sort(
    (left, right) => toNumber(right.shortfall_30d) - toNumber(left.shortfall_30d),
  )[1];

  const scopedGapRows = isAllBranches(branchId)
    ? gapRows
    : filterRowsByBranch(gapRows, branchId);
  const branchRows = scopedGapRows.length ? scopedGapRows : gapRows;

  const branchGapSummary = branchRows.map((item) => ({
    branchId: item.branch_id,
    branch: formatBranchLabel(item.branch_name),
    gap: toNumber(item.gap),
    gapPct: toNumber(item.gap_pct),
  }));

  const requiredKey = `total_technicians_required_${currentHorizon}d`;
  const gapKey = `total_headcount_gap_${currentHorizon}d`;

  const kpis = [
    {
      title: "Current Technicians",
      value: toNumber(summary.total_technicians_current),
      subText: `${toNumber(summary.total_branches_forecasted ?? branchRows.length)} branches forecasted`,
      positive: true,
      alert: false,
    },
    {
      title: `Required Headcount (${currentHorizon}D)`,
      value: toNumber(summary[requiredKey] ?? summary.total_technicians_required_30d),
      subText: `Model confidence ${summary.model_confidence_avg_pct || "n/a"}`,
      positive: true,
      alert: false,
    },
    {
      title: `Headcount Gap (${currentHorizon}D)`,
      value: toNumber(summary[gapKey] ?? summary.total_headcount_gap_30d),
      subText: `Average overtime ${formatPercent(summary.overtime_utilization_pct_avg)}`,
      positive: false,
      alert: toNumber(summary.total_headcount_gap_30d) > 0,
    },
    {
      title: "Branches With Shortfall",
      value: toNumber(summary.branches_with_shortfall),
      subText: `${toNumber(summary.branches_with_surplus)} branches with surplus`,
      positive: true,
      alert: toNumber(summary.branches_with_shortfall) > 0,
    },
    {
      title: "Critical Skill Shortfall",
      value: summary.critical_skill_shortfall_category || "N/A",
      subText: skillLevelLabels || "L1 / L2 / L3 / Specialist",
      positive: true,
      alert: false,
    },
  ];

  const planning = [
    {
      type: "redeployment",
      title: "REDEPLOYMENT",
      description: topRedeployment
        ? topRedeployment.rationale ||
          topRedeployment.reasoning ||
          `${formatBranchLabel(topRedeployment.from_branch_name || topRedeployment.from_branch_id)} -> ${formatBranchLabel(topRedeployment.to_branch_name || topRedeployment.to_branch_id)}`
        : summary.summary_reasoning || "No redeployment recommendation available",
    },
    {
      type: "pipeline",
      title: "HIRING PIPELINE (30D)",
      description: topHiring
        ? `${toNumber(topHiring.recommended_hires)} hires recommended for ${topHiring.skill_level}. 30-day shortfall: ${toNumber(topHiring.shortfall_30d)}.`
        : "No hiring pipeline available",
    },
    {
      type: "watch",
      title: "OVERTIME WATCH",
      description: `Average overtime utilization is ${formatPercent(summary.overtime_utilization_pct_avg)}.${
        secondHiring ? ` ${secondHiring.skill_level} is the next skill to watch.` : ""
      }`,
    },
  ];

  const scopedTableRows = isAllBranches(branchId)
    ? tableRows
    : filterRowsByBranch(tableRows, branchId);

  const rows = (scopedTableRows.length ? scopedTableRows : tableRows).map((row) => ({
    id: row.prediction_id,
    branch: formatBranchLabel(row.branch_name),
    branchId: row.branch_id,
    skill: row.skill_category,
    period: formatDate(row.period_date),
    required: toNumber(row.predicted_headcount_required),
    rostered: toNumber(row.effective_available_headcount),
    shortfall: pick(
      row.predicted_skill_shortfall,
      toNumber(row.predicted_headcount_required) - toNumber(row.effective_available_headcount),
    ),
    confidence: Math.round(toNumber(row.prediction_confidence) * 100),
    confidenceLabel:
      row.prediction_confidence_pct ||
      `${Math.round(toNumber(row.prediction_confidence) * 100)}%`,
    gapStatus: row.gap_status,
    overtimeUtilization: row.overtime_utilization_pct_4wk,
    actions: {
      canViewDetail: row.actions?.can_view_detail ?? true,
      canOverride: row.actions?.can_override ?? false,
      canRaiseHiringRequest: row.actions?.can_raise_hiring_request ?? false,
      canTriggerRedeployment: row.actions?.can_trigger_redeployment ?? false,
      canExport: row.actions?.can_export ?? true,
    },
  }));

  return {
    metadata,
    summary,
    filters: filter_definitions,
    appliedFilters: applied_filters,
    modelPerformance: model_performance,
    kpis,
    planning,
    branchGapSummary,
    charts: {
      skill: buildSkillChart(skillRows),
      headcountTrend: buildLineChart(trendRows),
      branchGap: buildHeatmapMatrix(heatmapRows),
      branchGapSummary: buildBranchGapChart(branchRows),
      overtimeRisk: {
        labels: overtimeRows.map((item) =>
          new Date(item.period_date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
          }),
        ),
        datasets: [
          {
            label: "Overtime Utilization",
            data: overtimeRows.map((item) => toNumber(item.overtime_utilization_pct)),
            borderColor: "#F5B400",
            backgroundColor: "rgba(245,180,0,0.12)",
            fill: true,
            tension: 0.3,
            borderWidth: 2,
            pointRadius: 3,
          },
        ],
      },
    },
    table: {
      rows,
      totalRows: rows.length,
    },
  };
};

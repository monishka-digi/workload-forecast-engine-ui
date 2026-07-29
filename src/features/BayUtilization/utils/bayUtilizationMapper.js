import { formatBranchLabel } from "../../../utils/branchFilters";

const pick = (...values) =>
  values.find((value) => value !== undefined && value !== null);

const toNumber = (value) => Number(value ?? 0);

const toPercent = (value) => toNumber(value);

const getBayTypeValue = (item) =>
  pick(
    item.predicted_utilization_pct,
    item.avg_utilization_30d,
    item.avg_utilization_pct,
    item.value,
    0,
  );

const buildHeatmap = (rows = []) => {
  const grouped = {};

  rows.forEach((item) => {
    const branchId = item.branch_id ?? item.branchId ?? item.branch;
    const branchName = formatBranchLabel(item.branch_name ?? item.branch ?? branchId);
    const bayType = item.bay_type ?? item.bayType;
    const utilization = pick(
      item.avg_util_30d,
      item.avg_utilization_pct,
      item.predicted_utilization_pct,
      item.value,
    );

    if (!branchId || !bayType) {
      return;
    }

    if (!grouped[branchId]) {
      grouped[branchId] = {
        branch: branchName,
        branchId,
      };
    }

    grouped[branchId][bayType] = utilization;
  });

  return Object.values(grouped);
};

export const mapBayUtilizationData = (response, forecastDays = 30) => {
  if (!response) return null;

  const {
    metadata = {},
    summary = {},
    graph_data = {},
    forecast_table = {},
    filter_definitions = {},
    applied_filters = {},
  } = response;

  const tableRows = Object.values(forecast_table || {}).flat();
  const heatmapSource = graph_data.branch_bay_heatmap?.length
    ? graph_data.branch_bay_heatmap
    : tableRows;

  const bayTypeUtilization = graph_data.bay_type_utilization_bar || [];
  const heatmap = buildHeatmap(heatmapSource);
  const utilizationStatusLabels = Object.fromEntries(
    (filter_definitions.utilization_status_options || []).map((option) => [
      option.value,
      option.label,
    ]),
  );

  const currentHorizon = Number(
    applied_filters.forecast_horizon_days ??
      metadata.forecast_horizon_days ??
      forecastDays,
  );
  const horizonLabel = `${currentHorizon}D`;

  const avgUtilization = pick(
    summary.avg_utilization_pct,
    summary[`avg_utilization_pct_${currentHorizon}d`],
    summary.avg_utilization_pct_30d,
    0,
  );

  const nearCapacity = pick(
    summary.near_capacity_bay_types,
    summary[`near_capacity_bays_${currentHorizon}d`],
    summary.near_capacity_bays_30d,
    0,
  );

  const branchesWithAlert = pick(
    summary.branches_with_bay_overload,
    summary.branches_with_bay_overload_30d,
    0,
  );

  const mostLoadedType = pick(
    summary.bay_type_highest_utilization,
    bayTypeUtilization[0]?.bay_type ?? bayTypeUtilization[0]?.label,
    "N/A",
  );

  const kpis = [
    {
      title: `Average Utilization (${horizonLabel})`,
      value: `${toPercent(avgUtilization).toFixed(1)}%`,
      subText: `${currentHorizon}-day forecast horizon`,
      positive: true,
      alert: false,
    },
    {
      title: "Near-Capacity Bay Types",
      value: toNumber(nearCapacity),
      subText:
        utilizationStatusLabels.HIGH ||
        "Near-Capacity (>= near_capacity_threshold%)",
      positive: false,
      alert: toNumber(nearCapacity) > 0,
    },
    {
      title: "Over-Capacity Bay Types",
      value: toNumber(summary.over_capacity_bay_types ?? 0),
      subText:
        utilizationStatusLabels.CRITICAL ||
        "Over-Capacity (>= critical_capacity_threshold%)",
      positive: false,
      alert: toNumber(summary.over_capacity_bay_types ?? 0) > 0,
    },
    {
      title: "Branches With Bay Overload",
      value: toNumber(branchesWithAlert),
      subText:
        utilizationStatusLabels.CRITICAL ||
        "Over-Capacity (>= critical_capacity_threshold%)",
      positive: false,
      alert: toNumber(branchesWithAlert) > 0,
    },
    {
      title: "Highest Utilization Bay Type",
      value: mostLoadedType,
      subText: `${toPercent(
        pick(
          summary.peak_utilization_pct,
          bayTypeUtilization[0]?.predicted_utilization_pct,
          bayTypeUtilization[0]?.avg_utilization_30d,
          bayTypeUtilization[0]?.avg_utilization_pct,
          0,
        ),
      ).toFixed(1)}%`,
      positive: true,
      alert: false,
    },
  ];

  const utilizationChart = bayTypeUtilization.map((item) => ({
    label: item.bay_type ?? item.label,
    value: toPercent(getBayTypeValue(item)),
    bayCount: toNumber(item.bay_count),
    nearCapacityDays: toNumber(item.near_capacity_days),
    overflowRisk: toNumber(item.overflow_risk_score),
  }));

  const rows = tableRows.map((row) => ({
    id: row.prediction_id ?? `${row.branch_id}-${row.bay_type}-${row.period_date}`,
    branch: formatBranchLabel(row.branch_name ?? row.branch_id),
    branchId: row.branch_id,
    bayType: row.bay_type,
    period: row.period_date,
    utilization: toPercent(
      pick(
        row.predicted_utilization_pct,
        row.avg_utilization_pct,
        row.avg_util_30d,
        0,
      ),
    ),
    lower: toPercent(
      pick(
        row.predicted_utilization_pct_p10,
        row.p10,
        row.avg_utilization_pct_p10,
        row.value,
        0,
      ),
    ),
    upper: toPercent(
      pick(
        row.predicted_utilization_pct_p90,
        row.p90,
        row.avg_utilization_pct_p90,
        row.value,
        0,
      ),
    ),
    nearCapacity: row.near_capacity_flag ?? row.nearCapacityFlag ?? false,
    overflowRisk: row.overflow_risk_pct ?? row.overflow_risk_score ?? 0,
    jobs: pick(row.jobs_scheduled, row.predicted_jobs, 0),
    maintenanceFlag: row.bay_maintenance_flag ?? false,
    reasoning: row.reasoning,
    actions: {
      canViewDetail: row.actions?.can_view_detail ?? row.actions?.can_view ?? true,
      canScheduleMaintenance:
        row.actions?.can_schedule_maintenance ??
        row.actions?.can_reallocate ??
        false,
      canTriggerOverflowAlert:
        row.actions?.can_trigger_overflow_alert ??
        row.actions?.can_trigger_alert ??
        false,
      canExport: row.actions?.can_export ?? true,
    },
  }));

  return {
    metadata,
    summary,
    filters: filter_definitions,
    appliedFilters: applied_filters,
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
 
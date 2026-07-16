import { filterRowsByBranch, isAllBranches } from "../../../utils/branchFilters";

const toNumber = (value) => Number(value ?? 0);

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(toNumber(value));

const buildHeatmap = (rows = []) => {
  const grouped = {};

  rows.forEach((item) => {
    const branchName = item.branch_name;
    const category = item.category;
    const value = toNumber(item.predicted_qty_30d);

    if (!grouped[branchName]) {
      grouped[branchName] = {
        branch: branchName,
        branchId: item.branch_id,
      };
    }

    grouped[branchName][category] = value;
  });

  return Object.values(grouped);
};

const buildBranchCategoryMix = (rows = []) => {
  const branches = [...new Set(rows.map((item) => item.branch_name))];
  const categories = [...new Set(rows.map((item) => item.category))];

  const colors = [
    "#f5b400",
    "#12BE83",
    "#8bc34a",
    "#cddc39",
    "#66bb6a",
    "#a5d6a7",
    "#7cb342",
    "#d4e157",
  ];

  return {
    labels: branches,
    datasets: categories.map((category, index) => ({
      label: category,
      data: branches.map((branch) => {
        const row = rows.find(
          (item) => item.branch_name === branch && item.category === category,
        );

        return row ? toNumber(row.predicted_qty_30d) : 0;
      }),
      backgroundColor: colors[index % colors.length],
      borderRadius: 4,
      borderSkipped: false,
    })),
  };
};

const buildCategoryDemandFromRows = (rows = []) => {
  const totals = new Map();

  rows.forEach((item) => {
    const category = item.category;
    totals.set(category, (totals.get(category) ?? 0) + toNumber(item.predicted_qty_30d));
  });

  return {
    labels: Array.from(totals.keys()),
    datasets: [
      {
        data: Array.from(totals.values()),
      },
    ],
  };
};

const buildAccuracyChart = (rows = []) => ({
  labels: rows.map((item) => item.component_category),
  datasets: [
    {
      label: "Forecast",
      data: rows.map((item) => toNumber(item.predicted_qty)),
      backgroundColor: "#f5b400",
      borderRadius: 8,
    },
    {
      label: "Actual",
      data: rows.map((item) => toNumber(item.actual_qty)),
      backgroundColor: "#12BE83",
      borderRadius: 8,
    },
  ],
});

const buildTrendChart = (trendRows = []) => ({
  labels: trendRows.map((item) =>
    new Date(item.period_date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    }),
  ),
  datasets: [
    {
      label: "Forecast Qty",
      data: trendRows.map((item) => toNumber(item.predicted_qty)),
      borderColor: "#f5b400",
      backgroundColor: "rgba(245,180,0,0.10)",
      borderWidth: 2,
      pointRadius: 3,
      tension: 0.4,
      fill: false,
    },
    {
      label: "Actual Qty",
      data: trendRows.map((item) => toNumber(item.actual_qty)),
      borderColor: "#12BE83",
      backgroundColor: "rgba(18,190,131,0.10)",
      borderWidth: 2,
      pointRadius: 3,
      tension: 0.4,
      fill: false,
    },
  ],
});

export const mapComponentDemandData = (
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
    stockout_risk_alerts = [],
    model_performance = {},
    filter_definitions = {},
    applied_filters = {},
  } = response;

  const categoryBar = graph_data.category_demand_bar_30d || [];
  const branchCategoryHeatmap = graph_data.branch_x_category_heatmap || [];
  const trendLines = graph_data.category_demand_trend_lines || {};
  const forecastVsActual = graph_data.forecast_vs_actual_by_category || [];
  const currentHorizon = Number(
    applied_filters.forecast_horizon_days ??
      metadata.forecast_horizons?.[0] ??
      forecastDays,
  );

  const scopedBranchRows = isAllBranches(branchId)
    ? branchCategoryHeatmap
    : filterRowsByBranch(branchCategoryHeatmap, branchId);

  const branchRows = scopedBranchRows.length ? scopedBranchRows : branchCategoryHeatmap;

  const kpis = [
    {
      title: "Categories Forecasted",
      value: toNumber(summary.total_categories_forecasted),
      subText: `${summary.total_branches_forecasted ?? 0} branches forecasted`,
      positive: true,
      alert: false,
    },
    {
      title: "Forecast Units (30D)",
      value: toNumber(summary.total_units_forecast_30d).toLocaleString("en-IN"),
      subText: `Model confidence ${summary.model_confidence_avg_pct || "n/a"}`,
      positive: true,
      alert: false,
    },
    {
      title: "Forecast Cost",
      value: `₹ ${formatCurrency(summary.total_cost_forecast_30d_inr)}`,
      subText: `${currentHorizon}-day horizon`,
      positive: true,
      alert: false,
    },
    {
      title: "Highest Demand Category",
      value: summary.highest_demand_category || "N/A",
      subText: `${toNumber(summary.highest_demand_category_units_30d).toLocaleString("en-IN")} units`,
      positive: true,
      alert: false,
    },
    {
      title: "Stockout Risk",
      value: toNumber(summary.categories_with_stockout_risk),
      subText: "High-risk categories",
      positive: false,
      alert: toNumber(summary.categories_with_stockout_risk) > 0,
    },
  ];

  const categoryDemand = isAllBranches(branchId)
    ? {
        labels: categoryBar.map((item) => item.label),
        datasets: [
          {
            data: categoryBar.map((item) => toNumber(item.value)),
          },
        ],
      }
    : buildCategoryDemandFromRows(branchRows);

  const branchCategoryMix = buildBranchCategoryMix(branchRows);
  const heatmap = buildHeatmap(branchRows);

  const trendCategory = categoryBar[0]?.label || "Engine";
  const trend = trendLines[trendCategory] || [];
  const trendChart = buildTrendChart(trend);

  const accuracyChart = buildAccuracyChart(forecastVsActual);

  const alerts = filterRowsByBranch(stockout_risk_alerts, branchId).map((item) => ({
    id: item.alert_id,
    branch: item.branch_name,
    category: item.component_category,
    severity: item.severity,
    risk: item.stockout_risk_pct,
    message: item.message,
    reasoning: item.reasoning,
    reorderQty: item.recommended_reorder_qty,
  }));

  const tableRows = Object.values(forecast_table || {}).flat();

  const scopedTableRows = isAllBranches(branchId)
    ? tableRows
    : filterRowsByBranch(tableRows, branchId);

  const predictionTable = (scopedTableRows.length ? scopedTableRows : tableRows).map((row) => ({
    id: row.prediction_id,
    componentCategory: row.component_category,
    branchName: row.branch_name,
    branchId: row.branch_id,
    machineType: row.machine_type,
    customerSegment: row.customer_segment,
    stockOutRisk: row.stockout_risk_pct,
    stockOutRiskScore: row.stockout_risk_score,
    predictedQty: row.predicted_qty,
    predictedQtyP10: row.predicted_qty_p10,
    predictedQtyP90: row.predicted_qty_p90,
    avgUnitCost: row.avg_unit_cost,
    recommendedReorderQty: row.recommended_reorder_qty,
    reasoning: row.reasoning,
    actions: row.actions,
  }));

  return {
    metadata,
    summary,
    filters: filter_definitions,
    appliedFilters: applied_filters,
    modelPerformance: model_performance,
    kpis,
    alerts,
    charts: {
      trend: trendChart,
      categoryDemand,
      branchCategoryMix,
      heatmap,
      accuracy: accuracyChart,
    },
    table: {
      rows: predictionTable,
      totalRows: predictionTable.length,
    },
  };
};

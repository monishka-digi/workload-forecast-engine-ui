import {
  filterRowsByBranch,
  formatBranchLabel,
  isAllBranches,
} from "../../../utils/branchFilters";
import { formatIsoDateLabel } from "../../../utils/formatIsoDateLabel";

const toNumber = (value) => Number(value ?? 0);

const getHorizonSuffix = (forecastDays = 30) => `${Number(forecastDays) || 30}d`;

const pickHorizonKey = (baseKey, horizonSuffix) => `${baseKey}_${horizonSuffix}`;

const pickHorizonValue = (source = {}, baseKey, horizonSuffix, fallback = null) =>
  source?.[pickHorizonKey(baseKey, horizonSuffix)] ??
  source?.[baseKey] ??
  source?.[`${baseKey}_30d`] ??
  fallback;

const pickForecastCost = (summary, horizonSuffix) =>
  summary?.[`total_cost_forecast_${horizonSuffix}_inr`] ?? null;

const pickHorizonArray = (source = {}, baseKey, horizonSuffix) =>
  source?.[pickHorizonKey(baseKey, horizonSuffix)] ??
  source?.[`${baseKey}_30d`] ??
  source?.[baseKey] ??
  [];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(toNumber(value));

// Shared category color map so the same category reads as the same color
// across CategoryDemandChart, BranchCategoryMixChart, and the trend chart.
// Falls back to the existing mix-chart palette for any category not listed.
const CATEGORY_COLORS = {
  Engine: "#f5b400",
  Hydraulic: "#12BE83",
  Electrical: "#8bc34a",
  Transmission: "#cddc39",
  Undercarriage: "#66bb6a",
  // Cooling: "#a5d6a7",
};

const CATEGORY_COLOR_FALLBACK = [
  "#f5b400",
  "#12BE83",
  "#8bc34a",
  "#cddc39",
  "#66bb6a",
  "#a5d6a7",
  "#7cb342",
  "#d4e157",
];

const colorForCategory = (label, index) =>
  CATEGORY_COLORS[label] || CATEGORY_COLOR_FALLBACK[index % CATEGORY_COLOR_FALLBACK.length];

const buildHeatmap = (rows = []) => {
  const grouped = {};

  rows.forEach((item) => {
    const branchName = formatBranchLabel(item.branch_name);
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
  const branches = [...new Set(rows.map((item) => formatBranchLabel(item.branch_name)))];
  const categories = [...new Set(rows.map((item) => item.category))];

  return {
    labels: branches,
    datasets: categories.map((category, index) => ({
      label: category,
      data: branches.map((branch) => {
        const row = rows.find(
          (item) => formatBranchLabel(item.branch_name) === branch && item.category === category,
        );

        return row ? toNumber(row.predicted_qty_30d) : 0;
      }),
      backgroundColor: colorForCategory(category, index),
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

  const labels = Array.from(totals.keys());

  return {
    labels,
    datasets: [
      {
        label: "Predicted Qty",
        data: Array.from(totals.values()),
        backgroundColor: labels.map((label, i) => colorForCategory(label, i)),
        borderRadius: 6,
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

/**
 * cost_impact_stacked_bar rows look like:
 *   { period_date, Engine: 197, Hydraulic: 219, Electrical: 162, Transmission: 554 }
 * i.e. one row per period with a numeric field per category. Categories are
 * derived from the row keys themselves (excluding period_date) rather than
 * hardcoded, so a category added to the API response shows up automatically.
 *
 * Note: per the API's own data_quality_flags, Hydraulic and Transmission
 * have no matched unit_cost data in this model run, so these figures are
 * quantity-shaped, not a validated cost figure, for those two categories.
 */
const buildCostImpactStackedBar = (rows = []) => {
  if (rows.length === 0) return { labels: [], datasets: [] };

  const categories = Object.keys(rows[0]).filter((key) => key !== "period_date");
  const labels = rows.map((row) => formatIsoDateLabel(row.period_date));

  return {
    labels,
    datasets: categories.map((category, index) => ({
      label: category,
      data: rows.map((row) => toNumber(row[category])),
      backgroundColor: colorForCategory(category, index),
      borderRadius: 4,
      borderSkipped: false,
      stack: "cost",
    })),
  };
};

/**
 * machine_type_to_category_sankey has casing/whitespace variants of the same
 * machine type (e.g. "CAT 336D" / "Cat 336D" / "cat 336d") flagged in the
 * API's own data_quality_flags as a naming mismatch. Merges those into one
 * canonical node (first-seen casing wins) and sums their values, rather than
 * showing near-duplicate rows in the diagram.
 *
 * Returns { fromNodes, toNodes, links } — a plain normalized link list, not
 * a Chart.js data object, since Chart.js has no built-in sankey chart type.
 * MachineCategorySankey renders this directly as SVG.
 */
const buildSankey = (links = []) => {
  const merged = new Map(); // "canonicalFrom|to" -> summed value
  const canonicalNames = new Map(); // lowercase key -> first-seen display name

  links.forEach((link) => {
    const key = link.from.trim().toLowerCase();
    if (!canonicalNames.has(key)) canonicalNames.set(key, link.from.trim());
    const canonicalFrom = canonicalNames.get(key);
    const mergedKey = `${canonicalFrom}|${link.to}`;
    merged.set(mergedKey, (merged.get(mergedKey) ?? 0) + link.value);
  });

  const normalizedLinks = Array.from(merged, ([mergedKey, value]) => {
    const [from, to] = mergedKey.split("|");
    return { from, to, value };
  });

  return {
    fromNodes: Array.from(new Set(normalizedLinks.map((l) => l.from))),
    toNodes: Array.from(new Set(normalizedLinks.map((l) => l.to))),
    links: normalizedLinks,
  };
};

const buildTrendRowsWithMarker = (trendRows = [], currentDateMarker) => {
  if (!currentDateMarker) {
    return {
      rows: trendRows,
      markerIndex: trendRows.findIndex((item) => item.is_forecast),
    };
  }

  const exactIndex = trendRows.findIndex((item) => item.period_date === currentDateMarker);
  if (exactIndex >= 0) {
    return {
      rows: trendRows,
      markerIndex: exactIndex,
    };
  }

  const markerRow = {
    period_date: currentDateMarker,
    predicted_qty: null,
    predicted_qty_p10: null,
    predicted_qty_p90: null,
    actual_qty: null,
    is_forecast: true,
  };

  const markerDate = new Date(`${currentDateMarker}T00:00:00`);
  if (Number.isNaN(markerDate.getTime())) {
    return {
      rows: trendRows,
      markerIndex: trendRows.findIndex((item) => item.is_forecast),
    };
  }

  const insertIndex = trendRows.findIndex((item) => {
    const itemDate = new Date(`${item.period_date}T00:00:00`);
    return !Number.isNaN(itemDate.getTime()) && itemDate.getTime() > markerDate.getTime();
  });

  if (insertIndex < 0) {
    return {
      rows: [...trendRows, markerRow],
      markerIndex: trendRows.length,
    };
  }

  const rows = [...trendRows];
  rows.splice(insertIndex, 0, markerRow);

  return {
    rows,
    markerIndex: insertIndex,
  };
};

/**
 * Builds the trend chart's Chart.js data object plus the index of the row
 * where the forecast begins ("today"), so the component can drop a marker
 * there without needing to re-parse dates itself.
 *
 * IMPORTANT: actual_qty is null on forecast-period rows in the API response.
 * Previously this went through toNumber() and became 0, which made the
 * "Actual Qty" line visibly crash to zero right at the forecast boundary
 * instead of just stopping. Forecast rows are now left as null (and Actual
 * Qty is only ever read from non-forecast rows), so the line correctly ends
 * rather than dropping to zero.
 *
 * @param {Array<{period_date, predicted_qty, predicted_qty_p10, predicted_qty_p90, actual_qty, is_forecast}>} trendRows
 * @param {string} [todayMarker] - graph_data.current_date_marker, e.g. "2026-07-24"
 * @returns {{ data: object, todayIndex: number }}
 */
const buildTrendChart = (trendRows = [], todayMarker) => {
  const { rows, markerIndex } = buildTrendRowsWithMarker(trendRows, todayMarker);
  const labels = rows.map((item) => formatIsoDateLabel(item.period_date));

  const forecastStartIndex = rows.findIndex((item) => item.is_forecast);
  const resolvedTodayIndex = markerIndex >= 0 ? markerIndex : forecastStartIndex;

  // Actual Qty: only for real history. Forecast-period rows stay null so the
  // line stops instead of dropping to zero.
  const actualData = rows.map((item) => (item.is_forecast ? null : toNumber(item.actual_qty)));

  // Forecast Qty: only for forecast rows, but also carries the last actual
  // point (the row immediately before the first forecast row) so the dashed
  // segment connects to the solid line instead of floating separately.
  const forecastData = rows.map((item, i) => {
    if (item.is_forecast) return toNumber(item.predicted_qty);
    const next = rows[i + 1];
    if (next && next.is_forecast) return toNumber(item.actual_qty);
    return null;
  });

  const p90Data = rows.map((item) => (item.is_forecast ? toNumber(item.predicted_qty_p90) : null));
  const p10Data = rows.map((item) => (item.is_forecast ? toNumber(item.predicted_qty_p10) : null));

  const todayPoint = rows.map((item, i) =>
    i === resolvedTodayIndex ? toNumber(item.predicted_qty ?? item.actual_qty) : null,
  );

  return {
    data: {
      labels,
      datasets: [
        {
          label: "Actual Qty",
          data: actualData,
          borderColor: "#12BE83",
          backgroundColor: "rgba(18,190,131,0.10)",
          borderWidth: 2,
          pointRadius: 3,
          tension: 0.4,
          fill: false,
          spanGaps: false,
        },
        {
          label: "Forecast Qty",
          data: forecastData,
          borderColor: "#f5b400",
          backgroundColor: "rgba(245,180,0,0.10)",
          borderWidth: 2,
          borderDash: [6, 4],
          pointRadius: 0,
          tension: 0.4,
          fill: false,
          spanGaps: true,
        },
        {
          label: "P90",
          data: p90Data,
          borderColor: "transparent",
          backgroundColor: "rgba(245,180,0,0.12)",
          fill: "+1",
          pointRadius: 0,
          borderWidth: 0,
          spanGaps: true,
        },
        {
          label: "P10",
          data: p10Data,
          borderColor: "transparent",
          backgroundColor: "rgba(245,180,0,0.12)",
          fill: false,
          pointRadius: 0,
          borderWidth: 0,
          spanGaps: true,
        },
        {
          label: "Forecast Start",
          data: todayPoint,
          borderColor: "transparent",
          backgroundColor: "#ffffff",
          pointBackgroundColor: "#f5b400",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 7,
          showLine: false,
        },
      ],
    },
    todayIndex: resolvedTodayIndex,
  };
};

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

  const currentHorizon = Number(forecastDays) || 30;
  const horizonSuffix = getHorizonSuffix(currentHorizon);
  const categoryBar = pickHorizonArray(graph_data, "category_demand_bar", horizonSuffix);
  const branchCategoryHeatmap = pickHorizonArray(
    graph_data,
    "branch_x_category_heatmap",
    horizonSuffix,
  );
  const trendLines = graph_data.category_demand_trend_lines || {};
  const forecastVsActual = pickHorizonArray(
    graph_data,
    "forecast_vs_actual_by_category",
    horizonSuffix,
  );
  const costImpactRows = graph_data.cost_impact_stacked_bar || [];
  const sankeyLinks = graph_data.machine_type_to_category_sankey || [];

  const scopedBranchRows = isAllBranches(branchId)
    ? branchCategoryHeatmap
    : filterRowsByBranch(branchCategoryHeatmap, branchId);

  const branchRows = scopedBranchRows.length ? scopedBranchRows : branchCategoryHeatmap;
  const stockoutCategoryNames = Array.isArray(
    summary.categories_with_stockout_risk_names,
  )
    ? summary.categories_with_stockout_risk_names
    : String(summary.categories_with_stockout_risk_names || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

  const kpis = [
    {
      title: "Categories Forecasted",
      value: toNumber(summary.total_categories_forecasted),
      subText: `${summary.total_branches_forecasted ?? 0} branches forecasted`,
      positive: true,
      alert: false,
    },
    {
      title: `Forecast Units (${currentHorizon}D)`,
      value: toNumber(
        pickHorizonValue(summary, "total_units_forecast", horizonSuffix, 0),
      ).toLocaleString("en-IN"),
      subText: `Model confidence ${summary.model_confidence_avg_pct || "n/a"}`,
      positive: true,
      alert: false,
    },
    {
      title: `Forecast Cost (${currentHorizon}D)`,
      value:
        pickForecastCost(summary, horizonSuffix) != null
          ? `Rs. ${formatCurrency(pickForecastCost(summary, horizonSuffix))}`
          : "N/A",
      subText: `${currentHorizon}-day horizon`,
      positive: true,
      alert: false,
    },
    {
      title: "Highest Demand Category",
      value: summary.highest_demand_category || "N/A",
      subText: `${toNumber(
        pickHorizonValue(summary, "highest_demand_category_units", horizonSuffix, 0),
      ).toLocaleString("en-IN")} units`,
      positive: true,
      alert: false,
    },
    {
      title: "Categories Stockout Risk",
      value:
        stockoutCategoryNames.length > 0
          ? stockoutCategoryNames.join(", ")
          : toNumber(summary.categories_with_stockout_risk),
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
            label: "Predicted Qty",
            data: categoryBar.map((item) => toNumber(item.value)),
            backgroundColor: categoryBar.map((item, i) => colorForCategory(item.label, i)),
            borderRadius: 6,
          },
        ],
      }
    : buildCategoryDemandFromRows(branchRows);

  const branchCategoryMix = buildBranchCategoryMix(branchRows);
  const heatmap = buildHeatmap(branchRows);

  // Built for every category (rather than picking one) so the trend chart
  // component can offer a category switcher. Categories with no history
  // (e.g. "Undercarriage": []) are dropped rather than rendering an empty chart.
  const trendByCategory = {};
  Object.entries(trendLines).forEach(([category, rows]) => {
    if (Array.isArray(rows) && rows.length > 0) {
      trendByCategory[category] = buildTrendChart(rows, graph_data.current_date_marker);
    }
  });
  const trendCategories = Object.keys(trendByCategory);
  // Default selection: highest 30-day demand category, falling back to
  // whichever comes first in category_demand_bar_30d, then the first
  // category that actually has trend history.
  const defaultTrendCategory =
    [...categoryBar].sort((a, b) => toNumber(b.value) - toNumber(a.value))[0]?.label ||
    categoryBar[0]?.label ||
    trendCategories[0];

  const accuracyChart = buildAccuracyChart(forecastVsActual);
  const costImpactChart = buildCostImpactStackedBar(costImpactRows);
  const sankey = buildSankey(sankeyLinks);

  const alerts = filterRowsByBranch(stockout_risk_alerts, branchId).map((item) => ({
    id: item.alert_id,
    branch: formatBranchLabel(item.branch_name),
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
    branchName: formatBranchLabel(row.branch_name),
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
      trendByCategory,
      trendCategories,
      defaultTrendCategory,
      categoryDemand,
      branchCategoryMix,
      heatmap,
      accuracy: accuracyChart,
      costImpact: costImpactChart,
      sankey,
    },
    table: {
      rows: predictionTable,
      totalRows: predictionTable.length,
    },
  };
};

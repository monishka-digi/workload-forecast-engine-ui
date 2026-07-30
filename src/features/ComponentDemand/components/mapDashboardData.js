// mapDashboardData.js
//
// Single source of truth for turning the Component Category Demand Forecast
// API response into props for each dashboard component. Keeping this in one
// place means every chart stays in sync if the API contract shifts, and
// components never need to know the raw JSON shape.

/**
 * @param {object} apiResponse - the full { success, message, result } payload
 */
export function mapDashboardData(apiResponse) {
  const result = apiResponse?.result ?? {};
  const { metadata = {}, summary = {}, graph_data = {}, forecast_table = {}, stockout_risk_alerts = [] } = result;

  return {
    metadata: mapMetadata(metadata),
    summary: mapSummary(summary),
    dataQualityFlags: metadata.data_quality_flags ?? [],
    trendChart: mapTrendLines(graph_data.category_demand_trend_lines, graph_data.current_date_marker),
    categoryBar: mapCategoryBar(graph_data.category_demand_bar_30d),
    heatmap: mapHeatmap(graph_data.branch_x_category_heatmap),
    costStackedBar: mapCostStackedBar(graph_data.cost_impact_stacked_bar),
    sankey: mapSankey(graph_data.machine_type_to_category_sankey),
    tableRows: mapForecastTableToRows(forecast_table),
    alerts: mapAlerts(stockout_risk_alerts),
  };
}

function mapMetadata(metadata) {
  return {
    modelName: metadata.model_name,
    modelVersion: metadata.model_version,
    forecastRunDate: metadata.forecast_run_date,
    forecastPeriod: metadata.forecast_period,
    granularity: metadata.granularity,
    confidenceLevel: metadata.confidence_level,
  };
}

function mapSummary(summary) {
  return {
    totalCategories: summary.total_categories_forecasted,
    totalUnits30d: summary.total_units_forecast_30d,
    totalUnits60d: summary.total_units_forecast_60d,
    totalUnits90d: summary.total_units_forecast_90d,
    totalCost30d: summary.total_cost_forecast_30d_inr,
    totalCost60d: summary.total_cost_forecast_60d_inr,
    totalCost90d: summary.total_cost_forecast_90d_inr,
    highestDemandCategory: summary.highest_demand_category,
    highestDemandUnits30d: summary.highest_demand_category_units_30d,
    stockoutRiskCategories: summary.categories_with_stockout_risk_names ?? [],
    modelConfidencePct: summary.model_confidence_avg_pct,
    totalBranches: summary.total_branches_forecasted,
    reasoning: summary.summary_reasoning,
  };
}

// ---- Trend chart -----------------------------------------------------

/**
 * Returns { categories: string[], seriesByCategory: { [category]: point[] }, todayMarker: string }
 * Empty-array categories (e.g. "Undercarriage": []) are dropped automatically.
 */
function mapTrendLines(trendLines = {}, currentDateMarker) {
  const seriesByCategory = {};
  Object.entries(trendLines).forEach(([category, points]) => {
    if (Array.isArray(points) && points.length > 0) {
      seriesByCategory[category] = points;
    }
  });
  return {
    categories: Object.keys(seriesByCategory),
    seriesByCategory,
    todayMarker: currentDateMarker,
  };
}

// ---- Category bar chart -----------------------------------------------

function mapCategoryBar(bars = []) {
  return bars.map((b) => ({
    label: b.label,
    value: b.value,
    costInr: b.cost_inr,
    pctOfTotal: b.pct_of_total,
    stockoutRiskPct: b.stockout_risk_pct,
    stockoutRiskScore: b.stockout_risk_score,
    reasoning: b.reasoning,
  }));
}

// ---- Branch x category heatmap ----------------------------------------

/**
 * Returns { branches: string[], categories: string[], cellsByKey: { "branch|category": cell } }
 */
function mapHeatmap(cells = []) {
  const branchSet = new Map(); // branch_id -> branch_name (preserve first-seen order)
  const categorySet = new Set();
  const cellsByKey = {};

  cells.forEach((c) => {
    if (!branchSet.has(c.branch_id)) branchSet.set(c.branch_id, c.branch_name);
    categorySet.add(c.category);
    cellsByKey[`${c.branch_id}|${c.category}`] = {
      value: c.predicted_qty_30d,
      intensity: c.intensity,
    };
  });

  return {
    branches: Array.from(branchSet, ([id, name]) => ({ id, name })),
    categories: Array.from(categorySet),
    cellsByKey,
  };
}

// ---- Cost impact stacked bar --------------------------------------------

function mapCostStackedBar(rows = []) {
  if (rows.length === 0) return { periods: [], categories: [], data: [] };
  const categories = Object.keys(rows[0]).filter((k) => k !== "period_date");
  return {
    periods: rows.map((r) => r.period_date),
    categories,
    data: rows,
  };
}

// ---- Machine type -> category sankey ------------------------------------

/**
 * Normalizes machine_type casing variants (e.g. "CAT 336D" / "Cat 336D" / "cat 336d")
 * into one canonical node, summing their values. The API's own data_quality_flags
 * note this naming mismatch, so we fold it here rather than showing near-duplicate
 * rows in the diagram.
 */
function mapSankey(links = []) {
  const merged = new Map(); // "canonicalFrom|to" -> value
  const canonicalNames = new Map(); // lowercase -> preferred display name

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

  const fromNodes = Array.from(new Set(normalizedLinks.map((l) => l.from)));
  const toNodes = Array.from(new Set(normalizedLinks.map((l) => l.to)));

  return { fromNodes, toNodes, links: normalizedLinks };
}

// ---- Forecast table -> table rows ---------------------------------------

/**
 * Flattens forecast_table (an object keyed by category, each an array of
 * predictions) into the flat row shape ComponentDemandTable expects.
 */
export function mapForecastTableToRows(forecastTable = {}) {
  const rows = [];
  Object.values(forecastTable).forEach((predictions) => {
    if (!Array.isArray(predictions)) return;
    predictions.forEach((p) => {
      rows.push({
        id: p.prediction_id,
        componentCategory: p.component_category,
        branchName: p.branch_name,
        stockOutRisk: p.stockout_risk_pct,
        predictedQty: p.predicted_qty,
        reasoning: p.reasoning,
      });
    });
  });
  return rows;
}

// ---- Alerts --------------------------------------------------------------

function mapAlerts(alerts = []) {
  return alerts.map((a) => ({
    id: a.alert_id,
    category: a.component_category,
    branchName: a.branch_name,
    severity: a.severity,
    riskPct: a.stockout_risk_pct,
    message: a.message,
    reasoning: a.reasoning,
    recommendedReorderQty: a.recommended_reorder_qty,
    avgLeadTimeDays: a.avg_lead_time_days,
  }));
}

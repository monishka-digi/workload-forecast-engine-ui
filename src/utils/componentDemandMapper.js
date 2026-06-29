export const mapComponentDemandData = (response) => {
  if (!response) return null;
  

  const {
    metadata,
    summary,
    graph_data,
    forecast_table,
    stockout_risk_alerts,
    model_performance,
    filter_definitions,
  } = response;

  
  const kpis = [
    {
      title: "Categories Forecasted",
      value: summary.total_categories_forecasted,
      subText: `${summary.total_branches_forecasted} Branches`,
      positive: true,
      alert: false,
    },
    {
      title: "Forecast Units (30D)",
      value: summary.total_units_forecast_30d.toLocaleString(),
      subText: `${summary.yoy_demand_growth_pct}% YoY`,
      positive: true,
      alert: false,
    },
    {
      title: "Forecast Cost",
      value: `₹ ${(summary.total_cost_forecast_30d_inr / 10000000).toFixed(2)} Cr`,
      subText: "30 Days",
      positive: true,
      alert: false,
    },
    {
      title: "Forecast Accuracy",
      value: `${summary.forecast_accuracy_pct}%`,
      subText: `MAPE ${summary.mape_last_30d}%`,
      positive: true,
      alert: false,
    },
    {
      title: "Stockout Risk",
      value: summary.categories_with_stockout_risk,
      subText: "High Risk Categories",
      positive: false,
      alert: true,
    },
  ];

  const trend = graph_data?.category_demand_trend_lines?.Engine || [];

  const trendChart = {
    labels: trend.map((item) =>
      new Date(item.period_date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
    ),

    datasets: [
      {
        label: "Forecast",
        data: trend.map((item) => item.predicted_qty),
        borderColor: "#f5b400",
        backgroundColor: "#f5b400",
        tension: 0.4,
      },
      {
        label: "Actual",
        data: trend.map((item) => item.actual_qty),
        borderColor: "#37d8c3",
        backgroundColor: "#37d8c3",
        tension: 0.4,
      },
    ],
  };

  const categoryBar = graph_data?.category_demand_bar_30d || [];

  const categoryDemand = {
    labels: categoryBar.map((item) => item.label),

    datasets: [
      {
        data: categoryBar.map((item) => item.value),
      },
    ],
  };

  const heatmap = graph_data?.branch_category_heatmap || [];

  const branches = [...new Set(heatmap.map((item) => item.branch_name))];
  const categories = [...new Set(heatmap.map((item) => item.category))];

  const colors = [
    "#37d8c3",
    "#f5b400",
    "#ff7b72",
    "#7c5cff",
    "#00c2ff",
    "#8bc34a",
    "#ff9800",
    "#9c27b0",
  ];

  const branchCategoryMix = {
    labels: branches,

    datasets: categories.map((category, index) => ({
      label: category,

      data: branches.map((branch) => {
        const row = heatmap.find(
          (x) => x.branch_name === branch && x.category === category,
        );

        return row ? row.predicted_qty_30d : 0;
      }),

      backgroundColor: colors[index % colors.length],

      borderRadius: 4,

      borderSkipped: false,
    })),
  };

  const accuracyData = graph_data?.forecast_vs_actual_by_category || [];

  const accuracyChart = {
    labels: accuracyData.map((item) => item.category),

    datasets: [
      {
        label: "Forecast",
        data: accuracyData.map((item) => item.forecast_qty),
        backgroundColor: "#f5b400",
        borderRadius: 8,
      },
      {
        label: "Actual",
        data: accuracyData.map((item) => item.actual_qty),
        backgroundColor: "#37d8c3",
        borderRadius: 8,
      },
    ],
  };

  const alerts = (stockout_risk_alerts || []).map((item) => ({
    branch: item.branch_name,
    category: item.category,
    currentStock: item.current_stock,
    forecast: item.forecast_qty_30d,
    risk: (item.stockout_risk || "").toLowerCase(),
  }));

  const tableRows = Object.values(forecast_table || {}).flat();

  const predictionTable = tableRows.map((row) => ({
    id: row.prediction_id,

    componentCategory: row.component_category,

    branchName: row.branch_name,

    stockOutRisk: row.stockout_risk_pct,

    predictedQty: row.predicted_qty,

    avgUnitCost: row.avg_unit_cost,

    actions: row.actions,
  }));


  console.log(graph_data.branch_category_heatmap);
  return {
    metadata,

    summary,

    filters: filter_definitions,

    modelPerformance: model_performance,

    kpis,

    charts: {
      trend: trendChart,
      categoryDemand,
      branchCategoryMix,
      accuracy: accuracyChart,
    },

    alerts,

    table: {
      rows: predictionTable,
      totalRows: predictionTable.length,
    },
  };
};

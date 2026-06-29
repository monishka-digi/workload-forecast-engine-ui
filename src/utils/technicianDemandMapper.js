export const mapTechnicianDemandData = (response) => {
  if (!response) return null;

  const {
    metadata,
    summary,
    graph_data,
    forecast_table,
    redeployment_recommendations,
    hiring_pipeline,
    model_performance,
    filter_definitions,
  } = response;

  // ---------------- KPIs ----------------

  const kpis = [
    {
      title: "Total Required Headcount",
      value: summary.total_technicians_required_30d,
      subText: `${summary.total_headcount_gap_30d} Gap`,
      positive: true,
      alert: false,
    },
    {
      title: "Total Skill Shortfall",
      value: summary.total_headcount_gap_30d,
      subText: summary.critical_skill_shortfall_category,
      positive: false,
      alert: true,
    },
    {
      title: "Branches With Shortfall",
      value: summary.branches_with_shortfall,
      subText: `${summary.branches_with_surplus} Surplus`,
      positive: true,
      alert: false,
    },
    {
      title: "Skill Categories",
      value: filter_definitions.skill_level_options.length - 1,
      subText: "L1 / L2 / L3 / Specialist",
      positive: true,
      alert: false,
    },
    {
      title: "Avg MAE",
      value: model_performance.mae_headcount,
      subText: `${model_performance.accuracy_pct}% Accuracy`,
      positive: true,
      alert: false,
    },
  ];

  // ---------------- Skill Chart ----------------

  const skillChart = (
    graph_data?.skill_mix_required_vs_available_bar || []
  ).map((item) => ({
    skill: item.skill_level,
    required: item.required_30d,
    available: item.available_30d,
    shortfall: item.shortfall_30d,
    utilization: item.utilization_pct,
  }));

  // ---------------- Workforce Planning ----------------

  console.log(Object.keys(redeployment_recommendations[0]));
  console.log(redeployment_recommendations[0]);

  // ---------------- Workforce Planning ----------------

  // const planning = [
  //   ...(redeployment_recommendations || []).map((item) => ({
  //     id: item.recommendation_id,
  //     type: "Redeployment",
  //     title: "Redeployment Candidate",
  //     description: `${item.technicians_to_move} × ${item.skill_level} technicians, ${item.from_branch_name} → ${item.to_branch_name}`,
  //     priority: item.priority,
  //   })),

  //   ...(hiring_pipeline || []).map((item) => ({
  //     id: item.skill_level,
  //     type: "Hiring",
  //     title: `${item.skill_level} Hiring`,
  //     description: `Recommended hires: ${item.recommended_hires} • 30-day shortfall: ${item.shortfall_30d}`,
  //     priority: item.shortfall_30d > 0 ? "High" : "Normal",
  //   })),
  // ];
  // ---------------- Workforce Planning ----------------

  const topRedeployment = (redeployment_recommendations || []).sort(
    (a, b) => b.recommended_headcount - a.recommended_headcount,
  )[0];

  const topHiring = (hiring_pipeline || []).sort(
    (a, b) => b.shortfall_30d - a.shortfall_30d,
  )[0];

  const secondHiring = (hiring_pipeline || []).sort(
    (a, b) => b.shortfall_30d - a.shortfall_30d,
  )[1];

  const planning = [
    {
      type: "redeployment",

      title: "REDEPLOYMENT CANDIDATE",

      description: topRedeployment
        ? topRedeployment.rationale
        : "No redeployment recommendation available",
    },

    {
      type: "pipeline",

      title: "CERTIFICATION PIPELINE (30D)",

      description: topHiring
        ? `${topHiring.recommended_hires} technicians recommended for ${topHiring.skill_level}. Current 30-day shortfall: ${topHiring.shortfall_30d}.`
        : "No certification pipeline available",
    },

    {
      type: "attrition",

      title: "ATTRITION RISK",

      description: secondHiring
        ? `${secondHiring.skill_level} technicians expected to remain constrained with a ${secondHiring.shortfall_30d} headcount gap.`
        : "No attrition risk identified",
    },
  ];

  // ---------------- Table ----------------

  const rows = Object.values(forecast_table || {})
    .flat()
    .map((row) => ({
      id: row.prediction_id,

      branch: row.branch_name,

      skill: row.skill_category,

      period: row.period_date,

      required: row.predicted_headcount_required,

      rostered: row.effective_available_headcount,

      shortfall:
        row.predicted_headcount_required - row.effective_available_headcount,

      confidence:
        row.prediction_confidence_pct ??
        `${Math.round((row.prediction_confidence ?? 0) * 100)}%`,

      actions: {
        canApprove: row.actions?.can_approve ?? true,
        canEdit: row.actions?.can_edit ?? true,
      },
    }));

  return {
    metadata,

    summary,

    filters: filter_definitions,

    kpis,

    planning,

    charts: {
      skill: skillChart,
    },

    table: {
      rows,
      totalRows: rows.length,
    },
  };
};

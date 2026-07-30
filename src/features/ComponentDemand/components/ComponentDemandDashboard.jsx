import { useState } from "react";
import { mapDashboardData } from "./utils/mapDashboardData";
import CategoryDemandTrendChart from "./charts/CategoryDemandTrendChart";
import CategoryDemandBarChart from "./charts/CategoryDemandBarChart";
import BranchCategoryHeatmap from "./charts/BranchCategoryHeatmap";
import CostImpactStackedBar from "./charts/CostImpactStackedBar";
import MachineCategorySankey from "./charts/MachineCategorySankey";
import StockoutRiskAlerts from "./charts/StockoutRiskAlerts";
import ComponentDemandTable from "./ComponentDemandTable";
import "./ComponentDemandDashboard.css";

/**
 * @param {object} props
 * @param {object} props.apiResponse - the full { success, message, result } payload from the
 *   Component Category Demand Forecast Model endpoint
 */
export default function ComponentDemandDashboard({ apiResponse }) {
  const [flagsExpanded, setFlagsExpanded] = useState(false);
  const data = mapDashboardData(apiResponse);

  return (
    <div className="dashboardRoot">
      <DashboardHeader metadata={data.metadata} summary={data.summary} />

      {data.dataQualityFlags.length > 0 && (
        <div className="dqBanner">
          <div className="dqBannerHeader" onClick={() => setFlagsExpanded((v) => !v)}>
            <span>⚠ {data.dataQualityFlags.length} data quality notes on this run</span>
            <button className="dqBannerToggle">{flagsExpanded ? "Hide" : "Show"}</button>
          </div>
          {flagsExpanded && (
            <ul className="dqBannerList">
              {data.dataQualityFlags.map((flag, i) => (
                <li key={i}>{flag}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="dashboardGrid">
        <div className="dashboardGridFull">
          <CategoryDemandTrendChart
            categories={data.trendChart.categories}
            seriesByCategory={data.trendChart.seriesByCategory}
            todayMarker={data.trendChart.todayMarker}
          />
        </div>

        <div className="dashboardGridHalf">
          <CategoryDemandBarChart bars={data.categoryBar} />
        </div>
        <div className="dashboardGridHalf">
          <CostImpactStackedBar
            periods={data.costStackedBar.periods}
            categories={data.costStackedBar.categories}
            data={data.costStackedBar.data}
          />
        </div>

        <div className="dashboardGridFull">
          <BranchCategoryHeatmap
            branches={data.heatmap.branches}
            categories={data.heatmap.categories}
            cellsByKey={data.heatmap.cellsByKey}
          />
        </div>

        <div className="dashboardGridHalf">
          <MachineCategorySankey
            fromNodes={data.sankey.fromNodes}
            toNodes={data.sankey.toNodes}
            links={data.sankey.links}
          />
        </div>
        <div className="dashboardGridHalf">
          <StockoutRiskAlerts alerts={data.alerts} />
        </div>

        <div className="dashboardGridFull">
          <ComponentDemandTable rows={data.tableRows} />
        </div>
      </div>
    </div>
  );
}

function DashboardHeader({ metadata, summary }) {
  return (
    <div className="dashboardHeader">
      <div className="dashboardHeaderTop">
        <h2>Component Category Demand Forecast</h2>
        <span className="dashboardHeaderMeta">
          {metadata.modelName} v{metadata.modelVersion} · {metadata.forecastPeriod} · {metadata.granularity} ·{" "}
          {metadata.confidenceLevel} confidence
        </span>
      </div>
      <div className="summaryStrip">
        <SummaryStat label="30d units" value={summary.totalUnits30d?.toLocaleString()} />
        <SummaryStat label="60d units" value={summary.totalUnits60d?.toLocaleString()} />
        <SummaryStat label="90d units" value={summary.totalUnits90d?.toLocaleString()} />
        <SummaryStat label="30d cost" value={summary.totalCost30d != null ? `₹${Math.round(summary.totalCost30d).toLocaleString("en-IN")}` : "—"} />
        <SummaryStat label="Top category" value={summary.highestDemandCategory} />
        <SummaryStat label="Branches" value={summary.totalBranches} />
        <SummaryStat label="Model confidence" value={summary.modelConfidencePct} />
      </div>
      {summary.reasoning && <p className="dashboardHeaderReasoning">{summary.reasoning}</p>}
    </div>
  );
}

function SummaryStat({ label, value }) {
  return (
    <div className="summaryStat">
      <span className="summaryStatValue">{value ?? "—"}</span>
      <span className="summaryStatLabel">{label}</span>
    </div>
  );
}

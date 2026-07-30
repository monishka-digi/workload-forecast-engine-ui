import Card from "../../../components/Common/Card";
import InfoTooltip from "../../../components/Common/InfoTooltip";
import "./BranchCategoryHeatmap.css";

/**
 * @param {object} props
 * @param {Array<{branch, branchId, [category]: number}>} props.rows - dashboard.charts.heatmap
 */
export default function BranchCategoryHeatmap({ rows = [] }) {
  const chartTitleStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "20px",
    fontWeight: 700,
    color: "var(--text)",
    lineHeight: 1.2,
  };

  if (rows.length === 0) return null;

  // Categories are dynamic keys on each row (present only where that branch
  // has demand for that category), so the full set is derived by unioning
  // keys across every row rather than assuming a fixed list.
  const categories = [];
  const seen = new Set();
  rows.forEach((row) => {
    Object.keys(row).forEach((key) => {
      if (key !== "branch" && key !== "branchId" && !seen.has(key)) {
        seen.add(key);
        categories.push(key);
      }
    });
  });

  // buildHeatmap (componentDemandMapper.js) carries the raw quantity through
  // but doesn't preserve the API's HIGH/MEDIUM/LOW intensity label, so cells
  // are shaded here relative to the highest value in the whole grid instead.
  const allValues = rows.flatMap((row) => categories.map((c) => row[c]).filter((v) => typeof v === "number"));
  const maxValue = Math.max(...allValues, 1);

  const intensityClass = (value) => {
    if (value == null) return "heatmapCellMissing";
    const ratio = value / maxValue;
    if (ratio >= 0.66) return "heatmapCellHigh";
    if (ratio >= 0.33) return "heatmapCellMedium";
    return "heatmapCellLow";
  };

  return (
    <Card
      title={
        <div style={chartTitleStyle}>
          <span style={chartTitleStyle}>Demand Intensity by Branch</span>
          <InfoTooltip
            position="bottom"
            content="Predicted quantity by branch and component category, shaded relative to the highest value in this view"
          >
            <span className="infoIcon">i</span>
          </InfoTooltip>
        </div>
      }
      tag="Branch x Category"
      height="clamp(340px, 36vw, 430px)"
    >
      <div className="heatmapCardBody">
        <div className="heatmapLegend">
          <span><i className="heatmapCellHigh" />High</span>
          <span><i className="heatmapCellMedium" />Medium</span>
          <span><i className="heatmapCellLow" />Low</span>
        </div>
        <div className="heatmapWrapper">
          <table className="heatmapTable">
            <thead>
              <tr>
                <th className="heatmapBranchCol">Branch</th>
                {categories.map((cat) => (
                  <th key={cat}>{cat}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.branchId}>
                  <td className="heatmapBranchCol heatmapBranchName">{row.branch}</td>
                  {categories.map((cat) => {
                    const value = row[cat];
                    return (
                      <td key={cat} className={`heatmapCell ${intensityClass(value)}`}>
                        {value ?? "—"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}

import "./BayHeatmap.css";
import InfoTooltip from "../../../components/Common/InfoTooltip";

const bayTypes = ["General", "Hydraulic", "Overhaul", "Express", "PDI"];

export default function BayHeatmap({ data = [] }) {
  const getClass = (value) => {
    if (value == null) return "empty";

    if (value >= 95) return "critical";

    if (value >= 85) return "high";

    if (value >= 70) return "medium";

    return "low";
  };

  return (
    <div className="heatmapCard" style={{ height: "381px" }}>
      <div className="heatmapHeader">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <h3>Branch × Bay Type</h3>

          <InfoTooltip
            position="bottom"
            content="Cross-tab of average utilization % for each bay type across branches; dashes indicate no bays of that type at that branch."
          >
            <span className="infoIcon">i</span>
          </InfoTooltip>
        </div>

        <span>Average Utilization</span>
      </div>

      <div className="heatmapGrid">
        <div className="heatHead">Branch</div>

        {bayTypes.map((type) => (
          <div key={type} className="heatHead center">
            {type}
          </div>
        ))}

        {data.map((row) => (
          <>
            <div key={row.branch} className="branchName">
              {row.branch}
            </div>

            {bayTypes.map((type) => (
              <div
                key={`${row.branch}-${type}`}
                className={`heatCell ${getClass(row[type])}`}
              >
                {row[type] ? `${row[type]}%` : "-"}
              </div>
            ))}
          </>
        ))}
      </div>
    </div>
  );
}

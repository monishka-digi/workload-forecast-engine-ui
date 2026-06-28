import "./BayHeatmap.css";

const bayTypes = [
  "General",
  "Hydraulic",
  "Overhaul",
  "Express",
  "PDI",
];

export default function BayHeatmap({ data = [] }) {
  const getClass = (value) => {
    if (value == null) return "empty";

    if (value >= 95) return "critical";

    if (value >= 85) return "high";

    if (value >= 70) return "medium";

    return "low";
  };

  return (
    <div className="heatmapCard">
      <div className="heatmapHeader">
        <h3>Branch × Bay Type</h3>

        <span>Average Utilization</span>
      </div>

      <div className="heatmapGrid">
        <div className="heatHead">Branch</div>

        {bayTypes.map((type) => (
          <div
            key={type}
            className="heatHead center"
          >
            {type}
          </div>
        ))}

        {data.map((row) => (
          <>
            <div
              key={row.branch}
              className="branchName"
            >
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
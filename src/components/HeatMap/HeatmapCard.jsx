import "./HeatmapCard.css";

import Card from "../Common/Card";

export default function HeatmapCard({ data = [] }) {
  return (
    <Card
      title="Branch × Category Heatmap"
      tag="30 Day Forecast"
      height="420px"
    >
      <div className="heatmapContainer">
        <div className="heatmapHeader">
          <span>Branch</span>
          <span>Category</span>
          <span>Demand</span>
          <span>Utilization</span>
          <span>Risk</span>
        </div>

        <div className="heatmapBody">
          {data.map((item, index) => (
            <div key={index} className="heatmapRow">
              <span>{item.branch}</span>

              <span>{item.category}</span>

              <span>{item.demand}</span>

              <div className="utilization">
                <div className="progressTrack">
                  <div
                    className="progressFill"
                    style={{
                      width: `${item.utilization}%`,
                      background:
                        item.utilization >= 90
                          ? "#ef4444"
                          : item.utilization >= 75
                            ? "#f5b400"
                            : "#34d399",
                    }}
                  />
                </div>

                <small>{item.utilization}%</small>
              </div>

              <span className={`riskBadge ${item.risk}`}>
                {item.risk.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

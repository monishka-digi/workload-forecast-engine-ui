import "./BayUtilizationChart.css";

export default function BayUtilizationChart({ data = [] }) {
  return (
    <div className="bayCard">
      <div className="bayCardHeader">
        <h3>Utilization by Bay Type</h3>

        <span>Average 30 Days</span>
      </div>

      <div className="bayCardBody">
        {data.map((item) => (
          <div key={item.label} className="bayRow">
            <div className="bayInfo">
              <h4>{item.label}</h4>

              <p>{item.bayCount} Bays</p>
            </div>

            <div className="bayProgressContainer">
              <div className="bayProgressTrack">
                <div
                  className={`bayProgressFill ${
                    item.value >= 90
                      ? "critical"
                      : item.value >= 75
                        ? "warning"
                        : "normal"
                  }`}
                  style={{
                    width: `${item.value}%`,
                  }}
                />
              </div>

              <span className="bayPercent">{item.value.toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

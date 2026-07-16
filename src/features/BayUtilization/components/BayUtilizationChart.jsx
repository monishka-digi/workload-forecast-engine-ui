import "./BayUtilizationChart.css";
import InfoTooltip from "../../../components/Common/InfoTooltip";

export default function BayUtilizationChart({ data = [], forecastDays = 30 }) {
  return (
    <div className="bayCard">
      <div className="bayCardHeader">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <h3>Utilization by Bay Type</h3>

          <InfoTooltip
            position="bottom"
            content="This chart shows the average utilization rate over the periof for each bay type across your branches (aggregated, not branch-specific like the watchlist table). It's a quick visual health-check of which type of service bay is under the most strain system-wide"
          >
            <span className="infoIcon">i</span>
          </InfoTooltip>
        </div>

        <span>Average {forecastDays} Days</span>
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

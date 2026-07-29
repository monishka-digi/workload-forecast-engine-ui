import "./PredictionTable.css";
import InfoTooltip from "../../../components/Common/InfoTooltip";

function LoadBadge({ status }) {
  const colorMap = {
    CRITICAL: { bg: "rgba(239,68,68,0.15)", text: "#ef4444" },
    HIGH: { bg: "rgba(245,158,11,0.15)", text: "#f59e0b" },
    MEDIUM: { bg: "rgba(59,130,246,0.15)", text: "#3b82f6" },
    LOW: { bg: "rgba(52,214,184,0.15)", text: "#34d6b8" },
  };

  const style = colorMap[status] || colorMap.LOW;

  return (
    <span
      style={{
        padding: "2px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.5,
        background: style.bg,
        color: style.text,
      }}
    >
      {status}
    </span>
  );
}

function ConfidenceBar({ value }) {
  return (
    <div className="confidenceCell">
      <div className="confidenceTrack">
        <div className="confidenceFill" style={{ width: `${value}%` }} />
      </div>
      <span>{value}%</span>
    </div>
  );
}

function ActionButtons({ actions }) {
  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
      {actions?.can_view_detail && <button className="tableBtn">View</button>}
    </div>
  );
}

const getSelectedForecastKey = (forecastDays) => {
  const horizon = Number(forecastDays) || 30;

  if (horizon === 60) return "predictedJobs60d";
  if (horizon === 90) return "predictedJobs90d";
  return "predictedJobs";
};

export default function PredictionTable({
  rows = [],
  type = "jobVolume",
  forecastDays = 30,
}) {
  const selectedForecastKey = getSelectedForecastKey(forecastDays);
  const selectedForecastLabel = `Forecast (${Number(forecastDays) || 30}D)`;

  if (type === "componentDemand") {
    return (
      <div className="predictionCard">
        <div className="tableHeader">
          <h3>Prediction Details</h3>
          <span>{rows.length} Records</span>
        </div>
        <div className="tableWrapper">
          <table>
            <thead>
              <tr>
                <th>Branch</th>
                <th>Category</th>
                <th>Part No.</th>
                <th>Description</th>
                <th>Period</th>
                <th>Forecast Qty</th>
                <th>Confidence</th>
                <th>Current Stock</th>
                <th>Supplier</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.branch}</td>
                  <td>{row.category}</td>
                  <td>{row.partNumber}</td>
                  <td>{row.partDescription}</td>
                  <td>{row.period}</td>
                  <td>{row.predictedQty}</td>
                  <td>
                    <ConfidenceBar value={row.confidence} />
                  </td>
                  <td>{row.currentStock}</td>
                  <td>{row.supplier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="predictionCard">
      <div className="tableHeader">
        <h3>Prediction Details</h3>
        <span>{rows.length} Records</span>
      </div>

      <div className="tableWrapper">
        <table>
          <thead>
            <tr>
              <th>Branch</th>
              <th>Geography</th>
              <th>Period</th>
              <th>{selectedForecastLabel}</th>
              <th>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span>P10 - P90</span>

                  <InfoTooltip
                    position="bottom"
                    content="Shows the expected forecast range, from lower-demand to higher-demand scenarios"
                  >
                    <span className="infoIcon">i</span>
                  </InfoTooltip>
                </div>
              </th>
              <th>Load %</th>
              <th>Status</th>
              <th>Confidence</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{row.branch}</div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--text-secondary)",
                      marginTop: 2,
                    }}
                  >
                    {row.branchId}
                  </div>
                </td>

                <td>{row.geography}</td>

                <td style={{ whiteSpace: "nowrap" }}>{row.period}</td>

                <td style={{ fontWeight: 700, color: "var(--primary)" }}>
                  {row[selectedForecastKey] != null
                    ? Number(row[selectedForecastKey]).toFixed(1)
                    : "—"}
                </td>

                <td
                  style={{
                    fontSize: 12,
                    color: "var(--text-secondary)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.lower != null && row.upper != null
                    ? `${Number(row.lower).toFixed(1)} - ${Number(row.upper).toFixed(1)}`
                    : "—"}
                </td>

                <td>
                  <span
                    style={{
                      fontWeight: 700,
                      color:
                        row.loadPercentage >= 100
                          ? "var(--danger)"
                          : row.loadPercentage >= 85
                            ? "var(--warning)"
                            : "var(--text)",
                    }}
                  >
                    {row.loadPercentage != null
                      ? `${Number(row.loadPercentage).toFixed(1)}%`
                      : "—"}
                  </span>
                </td>

                <td>
                  <LoadBadge status={row.loadStatus} />
                </td>

                <td>
                  <ConfidenceBar value={row.confidence} />
                </td>

                <td>
                  <ActionButtons actions={row.actions} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

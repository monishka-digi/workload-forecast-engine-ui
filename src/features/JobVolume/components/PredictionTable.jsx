import "./PredictionTable.css";

/* ─── helpers ─────────────────────────────────────────────── */

function LoadBadge({ status }) {
  const colorMap = {
    CRITICAL: { bg: "rgba(239,68,68,0.15)", text: "#ef4444" },
    HIGH:     { bg: "rgba(245,158,11,0.15)", text: "#f59e0b" },
    MEDIUM:   { bg: "rgba(59,130,246,0.15)", text: "#3b82f6" },
    LOW:      { bg: "rgba(52,214,184,0.15)", text: "#34d6b8" },
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
      {actions?.can_view_detail && (
        <button className="tableBtn">View</button>
      )}
      {actions?.can_override && (
        <button className="tableBtn">Override</button>
      )}
      {actions?.can_trigger_alert && (
        <button className="tableBtn">Alert</button>
      )}
      {actions?.can_export && (
        <button className="tableBtn">Export</button>
      )}
    </div>
  );
}

/* ─── main component ──────────────────────────────────────── */

export default function PredictionTable({ rows = [], type = "jobVolume" }) {

  /* ── componentDemand table (unchanged) ── */
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
                  <td><ConfidenceBar value={row.confidence} /></td>
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

  /* ── jobVolume table (new structure) ── */
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
              <th>Forecast (30D)</th>
              <th>Forecast (60D)</th>
              <th>Forecast (90D)</th>
              <th>P10 – P90</th>
              <th>Load %</th>
              <th>Status</th>
              <th>Confidence</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                {/* Branch */}
                <td>
                  <div style={{ fontWeight: 600 }}>{row.branch}</div>
                  <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>
                    {row.branchId}
                  </div>
                </td>

                {/* Geography */}
                <td>{row.geography}</td>

                {/* Period */}
                <td style={{ whiteSpace: "nowrap" }}>{row.period}</td>

                {/* 30-Day forecast */}
                <td style={{ fontWeight: 700, color: "var(--primary)" }}>
                  {Number(row.predictedJobs ?? 0).toFixed(1)}
                </td>

                {/* 60-Day forecast */}
                <td style={{ color: "var(--text-secondary)" }}>
                  {row.predictedJobs60d != null
                    ? Number(row.predictedJobs60d).toFixed(1)
                    : "—"}
                </td>

                {/* 90-Day forecast */}
                <td style={{ color: "var(--text-secondary)" }}>
                  {row.predictedJobs90d != null
                    ? Number(row.predictedJobs90d).toFixed(1)
                    : "—"}
                </td>

                {/* P10 – P90 range */}
                <td style={{ fontSize: 12, color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                  {row.lower != null && row.upper != null
                    ? `${Number(row.lower).toFixed(1)} – ${Number(row.upper).toFixed(1)}`
                    : "—"}
                </td>

                {/* Load % */}
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

                {/* Load status badge */}
                <td>
                  <LoadBadge status={row.loadStatus} />
                </td>

                {/* Confidence bar */}
                <td>
                  <ConfidenceBar value={row.confidence} />
                </td>

                {/* Action buttons */}
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

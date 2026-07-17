import Card from "../../../components/Common/Card";
import InfoTooltip from "../../../components/Common/InfoTooltip";
import "../../JobVolume/components/dashboardChartCard.css";

export default function BranchGapChart({ data }) {
  const chartTitleStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "20px",
    fontWeight: 700,
    color: "var(--text)",
    lineHeight: 1.2,
  };

  if (!data) return null;

  const rowLabels = data.rowLabels || [];
  const columnLabels = data.columnLabels || [];
  const maxValue = data.maxValue || 0;

  const getCellTone = (value) => {
    if (value == null) return "empty";
    if (!maxValue) return "low";

    const ratio = value / maxValue;
    if (ratio >= 0.85) return "critical";
    if (ratio >= 0.65) return "high";
    if (ratio >= 0.35) return "medium";
    return "low";
  };

  const getCellStyle = (value) => {
    const tone = getCellTone(value);

    const palette = {
      empty: { background: "var(--divider)", color: "var(--text-secondary)" },
      low: {
        background: "rgba(52, 211, 153, 0.18)",
        color: "var(--text)",
      },
      medium: {
        background: "rgba(250, 204, 21, 0.22)",
        color: "var(--text)",
      },
      high: {
        background: "rgba(245, 158, 11, 0.25)",
        color: "var(--text)",
      },
      critical: {
        background: "rgba(239, 68, 68, 0.22)",
        color: "var(--text)",
      },
    };

    return palette[tone];
  };

  return (
    <Card
      title={
        <div style={chartTitleStyle}>
          <span style={chartTitleStyle}>Branch Headcount Gap</span>

          <InfoTooltip
            position="bottom"
            content="Heatmap view of skill demand by job type across the forecast horizon."
          >
            <span className="infoIcon">i</span>
          </InfoTooltip>
        </div>
      }
      tag="Technician Demand"
      height="clamp(430px, 42vw, 560px)"
    >
      <div className="dashboardChartCard__body">
        <div
          style={{
            width: "100%",
            minHeight: 0,
            overflow: "auto",
            paddingRight: 6,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `170px repeat(${columnLabels.length}, minmax(100px, 1fr))`,
              gap: 10,
              alignItems: "stretch",
              minWidth: columnLabels.length
                ? `${170 + columnLabels.length * 110}px`
                : "100%",
            }}
          >
            <div
              style={{
                color: "var(--text-secondary)",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Job Type
            </div>

            {columnLabels.map((label) => (
              <div
                key={label}
                style={{
                  color: "var(--text-secondary)",
                  fontSize: 12,
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                {label}
              </div>
            ))}

            {rowLabels.map((rowLabel, rowIndex) => (
              <div key={rowLabel} style={{ display: "contents" }}>
                <div
                  style={{
                    color: "var(--text)",
                    fontSize: 13,
                    fontWeight: 600,
                    paddingRight: 10,
                    alignSelf: "center",
                  }}
                >
                  {rowLabel}
                </div>

                {(data.rows?.[rowIndex]?.values || []).map((value, columnIndex) => (
                  <div
                    key={`${rowLabel}-${columnLabels[columnIndex]}`}
                    title={`${rowLabel} • ${columnLabels[columnIndex]}: ${value}`}
                    style={{
                      minHeight: 44,
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      background: getCellStyle(value).background,
                      color: getCellStyle(value).color,
                    }}
                  >
                    {value}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

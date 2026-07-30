import Card from "../../../components/Common/Card";
import InfoTooltip from "../../../components/Common/InfoTooltip";
import "../../JobVolume/components/dashboardChartCard.css";
import "./BranchHeadcountGapChart.css";

export default function BranchHeadcountGapChart({ data }) {
  const chartTitleStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "20px",
    fontWeight: 700,
    color: "var(--text)",
    lineHeight: 1.2,
  };

  if (!data?.rows?.length) return null;

  const rows = data.rows;
  const maxMagnitude = Math.max(
    ...rows.map((item) => Math.abs(Number(item.gap ?? 0))),
    0,
  );

  return (
    <Card
      title={
        <div style={chartTitleStyle}>
          <span style={chartTitleStyle}>Branch Workforce Forecast</span>

          <InfoTooltip
            position="bottom"
            content="Horizontal bar view of branch workforce gap. Green bars show surplus headcount, red bars show shortfall, and the bar lengths are aligned from the left for easier scanning."
          >
            <span className="infoIcon">i</span>
          </InfoTooltip>
        </div>
      }
      tag="Technician Demand"
      height="auto"
      style={{ height: "auto" }}
    >
      <div className="dashboardChartCard__body">
        <div className="branchWorkforceCard">
          {rows.map((item) => {
            const gap = Number(item.gap ?? 0);
            const magnitude = Math.abs(gap);
            const isShortfall = gap > 0;
            const isSurplus = gap < 0;
            const width = maxMagnitude > 0 ? (magnitude / maxMagnitude) * 100 : 0;

            return (
              <div key={item.branchId} className="branchWorkforceRow">
                <div className="branchWorkforceInfo">
                  <h4>{item.branchName}</h4>
                  <p>
                    Required {Number(item.required ?? 0).toLocaleString("en-IN")} | Available{" "}
                    {Number(item.available ?? 0).toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="branchWorkforceBarWrap">
                  <div className="branchWorkforceBarTrack">
                    <div
                      className={`branchWorkforceBar ${
                        isShortfall
                          ? "branchWorkforceBar--shortfall"
                          : isSurplus
                            ? "branchWorkforceBar--surplus"
                            : "branchWorkforceBar--neutral"
                      }`}
                      style={{ width: `${width}%` }}
                    />
                  </div>

                  <span
                    className={`branchWorkforceValue ${
                      isShortfall
                        ? "branchWorkforceValue--shortfall"
                        : isSurplus
                          ? "branchWorkforceValue--surplus"
                          : "branchWorkforceValue--neutral"
                    }`}
                  >
                    {isShortfall ? "+" : isSurplus ? "-" : ""}
                    {magnitude.toLocaleString("en-IN")}{" "}
                    {isShortfall ? "Shortfall" : isSurplus ? "Surplus" : "Balanced"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

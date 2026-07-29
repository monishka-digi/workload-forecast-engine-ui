import "./CategoryDemandChart.css";
import Card from "../../../components/Common/Card";
import InfoTooltip from "../../../components/Common/InfoTooltip";
import "../../JobVolume/components/dashboardChartCard.css";

export default function CategoryDemandChart({ data }) {
  if (!data) return null;

  const values = data.datasets[0].data;
  const max = Math.max(...values);

  const chartTitleStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "20px",
    fontWeight: 700,
    color: "var(--text)",
    lineHeight: 1.2,
  };

  return (
    <Card
      title={
        <div style={chartTitleStyle}>
          <span style={chartTitleStyle}>Demand by component category</span>

          <InfoTooltip
            position="bottom"
            content="Predicted parts consumption by component category, ranked from highest to lowest demand."
          >
            <span className="infoIcon">i</span>
          </InfoTooltip>
        </div>
      }
      tag="Predicted Qty"
      height="clamp(340px, 36vw, 430px)"
    >
      <div className="dashboardChartCard__body">
        <div className="categoryChart categoryChart--scroll">
          {data.labels.map((label, index) => {
            const value = values[index];

            return (
              <div className="categoryRow" key={label}>
                <div className="categoryName">{label}</div>

                <div className="categoryProgress">
                  <div
                    className="categoryFill"
                    style={{
                      width: `${(value / max) * 100}%`,
                    }}
                  />
                </div>

                <div className="categoryValue">{value.toLocaleString()}</div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

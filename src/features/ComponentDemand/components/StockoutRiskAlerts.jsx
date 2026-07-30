import Card from "../../../components/Common/Card";
import InfoTooltip from "../../../components/Common/InfoTooltip";
import "./StockoutRiskAlerts.css";

const SEVERITY_CLASS = {
  HIGH: "alertSeverityHigh",
  MEDIUM: "alertSeverityMedium",
  LOW: "alertSeverityLow",
};

/**
 * @param {object} props
 * @param {Array<{id, branch, category, severity, risk, message, reasoning, reorderQty}>} props.alerts - dashboard.alerts
 */
export default function StockoutRiskAlerts({ alerts = [] }) {
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
          <span style={chartTitleStyle}>Stockout Risk Alerts</span>
          <InfoTooltip
            position="bottom"
            content="Lead-time/growth proxy score, not a real inventory shortfall calculation — see the model's data quality notes"
          >
            <span className="infoIcon">i</span>
          </InfoTooltip>
        </div>
      }
      tag={`${alerts.length} active`}
      height="clamp(340px, 36vw, 430px)"
    >
      {alerts.length === 0 ? (
        <div className="alertsEmpty">No active stockout risk alerts for this selection.</div>
      ) : (
        <div className="alertsList">
          {alerts.map((a) => (
            <div key={a.id} className="alertRow">
              <span className={`alertSeverityBadge ${SEVERITY_CLASS[a.severity] ?? ""}`}>{a.severity}</span>
              <div className="alertBody">
                <div className="alertTitleRow">
                  <strong>{a.category}</strong>
                  <span className="alertBranch">{a.branch}</span>
                  <span className="alertRiskPct">{a.risk}</span>
                </div>
                <p className="alertMessage">{a.message}</p>
                <p className="alertMeta">Recommended reorder: {a.reorderQty} units</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

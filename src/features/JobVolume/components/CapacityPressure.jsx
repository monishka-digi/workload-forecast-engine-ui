import "./CapacityPressure.css";
import Card from "../../../components/Common/Card";
import GaugeRow from "./GaugeRow";
import InfoTooltip from "../../../components/Common/InfoTooltip";
import { filterRowsByBranch } from "../../../utils/branchFilters";
import "./dashboardChartCard.css";

export default function CapacityPressure({
  data = [],
  selectedBranch = "ALL",
}) {
  const scopedData =
    selectedBranch === "ALL"
      ? data
      : filterRowsByBranch(data, selectedBranch);
  const rows = scopedData.length ? scopedData : data;

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
              <span style={chartTitleStyle}>Capacity Pressure</span>
    
              <InfoTooltip
                position="bottom"
                content="Branch utilization as a share of total capacity — predicted job count against maximum capacity for each branch, shows each branch's predicted job volume as a % of its total capacity."
              >
                <span className="infoIcon">i</span>
              </InfoTooltip>
            </div>
          }
          height="clamp(360px, 40vw, 470px)"
        >         21   
      <div className="dashboardChartCard__body">
        <div className="capacityPressureList">
          {rows.map((branch) => (
            <GaugeRow
              key={branch.id}
              branch={branch.branch}
              value={branch.load}
              jobs={branch.jobs}
              // rating={branch.rating}
              color={branch.color}
              breach={branch.breach}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}

import Card from "../Common/Card";
import GaugeRow from "./GaugeRow";
import InfoTooltip from "../Common/Tooltip/InfoTooltip";

export default function CapacityPressure({ data = [] }) {

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
          height="350px"
        >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 18,
          marginTop: 10,
        }}
      >
        {data.map((branch) => (
          <GaugeRow
            key={branch.id}
            branch={branch.branch}
            value={branch.load}
            jobs={branch.jobs}
            rating={branch.rating}
            color={branch.color}
            breach={branch.breach}
          />
        ))}
      </div>
    </Card>
  );
}

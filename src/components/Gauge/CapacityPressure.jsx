import Card from "../Common/Card";
import GaugeRow from "./GaugeRow";

export default function CapacityPressure({ data = [] }) {
  return (
    <Card
      title="Capacity Pressure"
      tag="Branch Utilization"
      height="auto"
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
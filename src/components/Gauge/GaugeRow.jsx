import "./GaugeRow.css";

export default function GaugeRow({
  branch,
  value,
  jobs,
  rating,
  color,
  breach,
}) {
  return (
    <div className="gaugeRow">
      <div className="gaugeTop">
        <span className="branchName">{branch}</span>

        <span className="loadValue">{value}%</span>
      </div>

      <div className="progressTrack">
        <div
          className="progressFill"
          style={{
            width: `${Math.min(value, 100)}%`,
            background: color,
          }}
        />
      </div>

      <div className="gaugeBottom">
        <span>{jobs} Jobs</span>

        <span>{rating}</span>

        {breach && <span className="breach">Capacity Breach</span>}
      </div>
    </div>
  );
}

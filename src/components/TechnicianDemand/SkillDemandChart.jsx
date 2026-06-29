import "./SkillDemandChart.css";

export default function SkillDemandChart({ data = [] }) {
  const maxValue = Math.max(
    ...data.map((item) => item.required),
    1
  );

  return (
    <div className="skillChartCard">
      <div className="skillChartHeader">
        <h3>Required vs shortfall by skill</h3>

        <span>technicians_required</span>
      </div>

      <div className="skillChartBody">
        {data.map((item) => (
          <div
            key={item.skill}
            className="skillRow"
          >
            <div className="skillLabel">
              {item.skill}
            </div>

            <div className="skillBarWrapper">
              <div className="skillTrack">
                <div
                  className="skillFill"
                  style={{
                    width: `${(item.required / maxValue) * 100}%`,
                  }}
                />
              </div>

              <span className="skillValue">
                {item.required}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
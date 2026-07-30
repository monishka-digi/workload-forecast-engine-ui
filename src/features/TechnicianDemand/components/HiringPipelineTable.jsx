import "./HiringPipelineTable.css";

/**
 * @param {object} props
 * @param {Array<{skillLevel, shortfall30d, shortfall60d, shortfall90d, recommendedHires, avgOnboardingWeeks, urgency}>} props.rows - dashboard.hiringPipeline
 */
export default function HiringPipelineTable({ rows = [] }) {
  return (
    <div className="hiringTableCard">
      <div className="hiringTableHeader">
        <h3>Hiring pipeline</h3>
        <span>by_skill_level</span>
      </div>

      <div className="hiringTableWrapper">
        <table className="hiringTable">
          <thead>
            <tr>
              <th>SKILL LEVEL</th>
              <th>SHORTFALL (30D)</th>
              <th>SHORTFALL (60D)</th>
              <th>SHORTFALL (90D)</th>
              <th>RECOMMENDED HIRES</th>
              <th>AVG ONBOARDING</th>
              <th>URGENCY</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.skillLevel}>
                <td>{row.skillLevel}</td>
                <td>{row.shortfall30d.toFixed(1)}</td>
                <td>{row.shortfall60d.toFixed(1)}</td>
                <td>{row.shortfall90d.toFixed(1)}</td>
                <td>{row.recommendedHires}</td>
                <td>{row.avgOnboardingWeeks} wk</td>
                <td>
                  <span className={`urgencyBadge ${(row.urgency || "none").toLowerCase()}`}>
                    {row.urgency}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

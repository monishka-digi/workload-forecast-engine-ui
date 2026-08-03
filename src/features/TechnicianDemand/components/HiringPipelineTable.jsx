import "./HiringPipelineTable.css";
import useDashboardFilters from "../../../context/useDashboardFilters";
import { formatRoundedValue } from "../../../utils/formatRoundedValue";

/**
 * @param {object} props
 * @param {Array<{skillLevel, shortfall30d, shortfall60d, shortfall90d, recommendedHires, avgOnboardingWeeks, urgency}>} props.rows - dashboard.hiringPipeline
 */
export default function HiringPipelineTable({ rows = [] }) {
  const { forecastDays } = useDashboardFilters();
  const selectedHorizon = Number(forecastDays) || 30;
  const shortfallKey = `shortfall_${selectedHorizon}d`;
  const shortfallLabel = `SHORTFALL (${selectedHorizon}D)`;

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
              <th>{shortfallLabel}</th>
              <th>RECOMMENDED HIRES</th>
              <th>AVG ONBOARDING</th>
              <th>URGENCY</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.skillLevel}>
                <td>{row.skillLevel}</td>
                <td>{formatRoundedValue(row[shortfallKey] ?? row.shortfall30d, 1)}</td>
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

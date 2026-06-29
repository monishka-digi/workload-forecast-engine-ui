import "./TechnicianDemandTable.css";

export default function TechnicianDemandTable({ rows = [] }) {
  return (
    <div className="techTableCard">
      <div className="techTableHeader">
        <h3>Skill-level detail</h3>

        <span>primary_table_grouped_by_skill_category</span>
      </div>

      <div className="techTableWrapper">
        <table className="techTable">
          <thead>
            <tr>
              <th>BRANCH</th>
              <th>SKILL</th>
              <th>PERIOD</th>
              <th>REQUIRED (P50)</th>
              <th>ROSTERED</th>
              <th>SHORTFALL</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.branch}</td>

                <td>{row.skill}</td>

                <td>{row.period}</td>

                <td>{row.required}</td>

                <td>{row.rostered}</td>

                <td>
                  <span
                    className={`shortfallBadge ${
                      row.shortfall > 4
                        ? "high"
                        : row.shortfall > 0
                        ? "medium"
                        : "low"
                    }`}
                  >
                    {row.shortfall}
                  </span>
                </td>

                <td>
                  <button
                    className="approveBtn"
                    disabled={!row.actions.canApprove}
                  >
                    Approve
                  </button>

                  <button
                    className="editBtn"
                    disabled={!row.actions.canEdit}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
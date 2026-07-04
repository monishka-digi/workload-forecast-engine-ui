import "./BranchLoadTable.css";
import InfoTooltip from "../Common/Tooltip/InfoTooltip";

export default function BranchLoadTable({ rows = [] }) {
  return (
    <div className="branchTableCard">
      <div className="branchTableHeader">
        <h3>Branch detail</h3>

        <span>primary_table.rows</span>
      </div>

      <div className="branchTableWrapper">
        <table className="branchTable">
          <thead>
            <tr>
              <th>BRANCH</th>
              <th>GEOGRAPHY</th>
              <th>PERIOD</th>
              <th>PRED. LOAD %</th>
              <th>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span>CAPACITY GAP</span>

                  <InfoTooltip
                    position="bottom"
                    content="The buffer (or deficit) of remaining capacity — how many jobs/units of work the branch can still absorb before hitting 100% capacity, at that predicted load %."
                  >
                    <span className="infoIcon">i</span>
                  </InfoTooltip>
                </div>
              </th>
              <th>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span>BREACH</span>

                  <InfoTooltip
                    position="bottom"
                    content="Branches whose load/utilization % is forecasted to exceed a defined threshold (likely 100% capacity, or possibly a lower SLA threshold like 90%) — i.e., branches at risk of, or actively exceeding, their safe operating capacity"
                  >
                    <span className="infoIcon">i</span>
                  </InfoTooltip>
                </div>
              </th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.branch}</td>

                <td>{row.geography}</td>

                <td>{new Date(row.period).toLocaleDateString("en-CA")}</td>

                <td>{Number(row.predictedLoad).toFixed(1)}%</td>

                <td
                  className={
                    row.capacityGap > 0 ? "positiveGap" : "negativeGap"
                  }
                >
                  {row.capacityGap > 0 ? "+" : ""}
                  {row.capacityGap}
                </td>

                <td>
                  <span
                    className={`statusBadge ${row.breach ? "breach" : "ok"}`}
                  >
                    {row.breach ? "BREACH" : "OK"}
                  </span>
                </td>

                <td>
                  {row.actions?.canReallocate && (
                    <button className="reallocateBtn">Reallocate</button>
                  )}

                  {row.actions?.canView && (
                    <button className="viewBtn">View</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

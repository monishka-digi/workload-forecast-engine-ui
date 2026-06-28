import "./BranchLoadTable.css";

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
              <th>CAPACITY GAP</th>
              <th>BREACH</th>
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

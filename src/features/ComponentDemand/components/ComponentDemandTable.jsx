import "./ComponentDemandTable.css";

export default function ComponentDemandTable({ rows = [] }) {
  return (
    <div className="componentTableCard">
      <div className="componentTableHeader">
        <h3>Category Detail</h3>
      </div>

      <div className="componentTableWrapper">
        <table className="componentTable">
          <thead>
            <tr>
              <th>Component Category</th>
              <th>Branch Name</th>
              <th>Stock Out Risk</th>
              <th>Predicted Qty</th>
              <th>Reasoning</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => {
              const riskValue = parseInt(row.stockOutRisk ?? 0, 10);

              return (
                <tr key={row.id}>
                  <td>{row.componentCategory}</td>
                  <td>{row.branchName}</td>
                  <td>
                    <span
                      className={`riskBadge ${
                        riskValue >= 50
                          ? "high"
                          : riskValue >= 25
                            ? "medium"
                            : "low"
                      }`}
                    >
                      {row.stockOutRisk ?? "—"}
                    </span>
                  </td>
                  <td>{Number(row.predictedQty).toLocaleString()}</td>
                  <td className="reasoningCell">{row.reasoning || "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

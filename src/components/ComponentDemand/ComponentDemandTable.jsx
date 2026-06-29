import Card from "../Common/Card";
import MethodBadge from "./MethodBadge";

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
              <th>Avg Unit Cost</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.componentCategory}</td>

                <td>{row.branchName}</td>

                <td>
                  <span
                    className={`riskBadge ${
                      parseInt(row.stockOutRisk) >= 50
                        ? "high"
                        : parseInt(row.stockOutRisk) >= 25
                        ? "medium"
                        : "low"
                    }`}
                  >
                    {row.stockOutRisk}
                  </span>
                </td>

                <td>
                  {Number(row.predictedQty).toLocaleString()}
                </td>

                <td>
                  ₹ {Number(row.avgUnitCost).toLocaleString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
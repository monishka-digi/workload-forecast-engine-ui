import "./ComponentDemandTable.css";

export default function ComponentDemandTable({ rows = [] }) {
  return (
    <div className="predictionCard">
      <div className="tableHeader">
        <h3>Component Forecast Details</h3>

        <span>{rows.length} Records</span>
      </div>

      <div className="tableWrapper">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Branch</th>
              <th>Machine</th>
              <th>Segment</th>
              <th>Period</th>
              <th>Pred Qty</th>
              <th>P10 - P90</th>
              <th>Confidence</th>
              <th>Reorder Qty</th>
              <th>Avg Unit Cost</th>
              <th>Predicted Cost</th>
              <th>Risk</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.category}</td>

                <td>{row.branchId}</td>

                <td>{row.machine}</td>

                <td>{row.segment}</td>

                <td>{row.period}</td>

                <td>{row.predictedQty}</td>

                <td>
                  {row.lower} - {row.upper}
                </td>

                <td>
                  <div className="confidenceCell">
                    <div className="confidenceTrack">
                      <div
                        className="confidenceFill"
                        style={{
                          width: `${row.confidence}%`,
                        }}
                      />
                    </div>

                    <span>{row.confidenceLabel}</span>
                  </div>
                </td>

                <td>{row.reorderQty}</td>

                <td>₹ {row.avgUnitCost.toLocaleString()}</td>

                <td>₹ {row.predictedCost.toLocaleString()}</td>

                <td>{row.stockoutRisk}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
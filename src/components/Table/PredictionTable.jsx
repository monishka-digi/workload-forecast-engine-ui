import "./PredictionTable.css";

export default function PredictionTable({ rows = [], type = "jobVolume" }) {
  const renderHeader = () => {
    switch (type) {
      case "componentDemand":
        return (
          <tr>
            <th>Branch</th>
            <th>Category</th>
            <th>Part No.</th>
            <th>Description</th>
            <th>Period</th>
            <th>Forecast Qty</th>
            <th>P10-P90</th>
            <th>Confidence</th>
            <th>Current Stock</th>
            <th>Supplier</th>
          </tr>
        );

      default:
        return (
          <tr>
            <th>Branch</th>
            <th>Geography</th>
            <th>Machine</th>
            <th>Segment</th>
            <th>Period</th>
            <th>Forecast</th>
            <th>P10-P90</th>
            <th>Confidence</th>
            <th>Actions</th>
          </tr>
        );
    }
  };

  const renderRow = (row) => {
    switch (type) {
      case "componentDemand":
        return (
          <>
            <td>{row.branch}</td>
            <td>{row.category}</td>
            <td>{row.partNumber}</td>
            <td>{row.partDescription}</td>
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

                <span>{row.confidence}%</span>
              </div>
            </td>

            <td>{row.currentStock}</td>

            <td>{row.supplier}</td>
          </>
        );

      default:
        return (
          <>
            <td>{row.branch}</td>
            <td>{row.geography}</td>
            <td>{row.machine}</td>
            <td>{row.segment}</td>
            <td>{row.period}</td>

            <td>{row.predictedJobs}</td>

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

                <span>{row.confidence}%</span>
              </div>
            </td>

            <td>
              {row.actions?.can_view_detail && (
                <button className="tableBtn">View</button>
              )}

              {row.actions?.can_override && (
                <button className="tableBtn">Override</button>
              )}

              {row.actions?.can_trigger_alert && (
                <button className="tableBtn">Alert</button>
              )}

              {row.actions?.can_export && (
                <button className="tableBtn">Export</button>
              )}
            </td>
          </>
        );
    }
  };

  return (
    <div className="predictionCard">
      <div className="tableHeader">
        <h3>Prediction Details</h3>

        <span>{rows.length} Records</span>
      </div>

      <div className="tableWrapper">
        <table>
          <thead>{renderHeader()}</thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>{renderRow(row)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import Card from "../Common/Card";
import MethodBadge from "./MethodBadge";

export default function ComponentDemandTable({
  rows = [],
}) {
  return (
    <Card
      title="Category Detail"
      tag="primary_table grouped by component_category"
      height="auto"
    >
      <div className="tableWrapper">
        <table className="predictionTable">
          <thead>
            <tr>
              <th>Category</th>
              <th>Branch</th>
              <th>Driving Job Vol.</th>
              <th>Usage Rate / Job</th>
              <th>Pred. Qty (P50)</th>
              <th>Method</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.component_category}</td>

                <td>{row.branchId}</td>

                <td>
                  {row.drivingJobVolume?.toLocaleString()}
                </td>

                <td>{row.usageRate}</td>

                <td>
                  {row.predictedQty?.toLocaleString()}
                </td>

                <td>
                  <MethodBadge
                    method={row.method}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
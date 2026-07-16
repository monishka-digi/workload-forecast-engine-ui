import "./BranchGapSummary.css";

export default function BranchGapSummary({ summary = [] }) {
  const totalGap = summary.reduce((s, x) => s + x.gap, 0);

  const avgGap = totalGap / summary.length;

  const largest = [...summary].sort(
    (a, b) => Math.abs(b.gap) - Math.abs(a.gap),
  )[0];

  return (
    <div className="gapSummaryCard">
      <div className="gapKpis">
        <div>
          <h4>Total Gap</h4>

          <h2>{totalGap.toFixed(1)}</h2>
        </div>

        <div>
          <h4>Largest Gap</h4>

          <h2>{largest.branch}</h2>
        </div>

        <div>
          <h4>Average Gap</h4>

          <h2>{avgGap.toFixed(1)}</h2>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Branch</th>

            <th>Gap</th>
          </tr>
        </thead>

        <tbody>
          {summary.map((item) => (
            <tr key={item.branchId}>
              <td>{item.branch}</td>

              <td className={item.gap < 0 ? "danger" : "ok"}>
                {item.gap.toFixed(1)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

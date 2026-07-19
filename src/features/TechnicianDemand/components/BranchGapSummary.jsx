import "./BranchGapSummary.css";

export default function BranchGapSummary({ summary = [] }) {
  const totalGap = summary.reduce((sum, item) => sum + Number(item.gap || 0), 0);
  const avgGap = summary.length ? totalGap / summary.length : 0;
  const largest = [...summary].sort(
    (a, b) => Math.abs(Number(b.gap || 0)) - Math.abs(Number(a.gap || 0)),
  )[0];

  return (
    <div className="gapSummaryCard">
      <h3 className="gapSummaryTitle">Headcount Gap Summary</h3>

      <div className="gapSummaryGrid">
        <div className="gapMiniCard">
          <span>Total Gap</span>
          <strong>{totalGap.toFixed(1)}</strong>
        </div>

        <div className="gapMiniCard">
          <span>Largest Gap</span>
          <strong>{largest ? Number(largest.gap || 0).toFixed(1) : "—"}</strong>
          <small>{largest?.branch || "—"}</small>
        </div>

        <div className="gapMiniCard">
          <span>Average Gap</span>
          <strong>{avgGap.toFixed(1)}</strong>
        </div>
      </div>

      <div className="gapTableWrap">
        <table className="gapTable">
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
                  {Number(item.gap || 0).toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

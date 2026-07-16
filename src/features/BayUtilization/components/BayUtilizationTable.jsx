import "./BayUtilizationTable.css";
import InfoTooltip from "../../../components/Common/InfoTooltip";

export default function BayUtilizationTable({ rows = [] }) {
  return (
    <div className="bayTableCard">
      <div className="bayTableHeader">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <h3>Near Capacity Watchlist</h3>

          <InfoTooltip
            position="bottom"
            content="It's tracking bay-level workshop capacity across branches, bay types, and time periods, flagging which ones are running hot."
          >
            <span className="infoIcon">i</span>
          </InfoTooltip>
        </div>

        <span>{rows.length} Records</span>
      </div>

      <div className="bayTableWrapper">
        <table className="bayTable">
          <thead>
            <tr>
              
              <th>BRANCH</th>
              <th>BAY TYPE</th>
              <th>PERIOD</th>
              <th>UTILIZATION</th>
              {/* <th>DAY 10 - DAY 90</th> */}
              <th>JOBS</th>
              <th>OVERFLOW</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.branch}</td>

                <td>{row.bayType}</td>

                <td>{new Date(row.period).toLocaleDateString("en-CA")}</td>

                <td>{Number(row.utilization).toFixed(1)}%</td>

                {/* <td>
                  {row.lower}% - {row.upper}%
                </td> */}

                <td>{row.jobs}</td>

                <td>{row.overflowRisk}</td>

                <td>
                  <span
                    className={`bayStatus ${
                      row.nearCapacity ? "critical" : "normal"
                    }`}
                  >
                    {row.nearCapacity ? "Near Capacity" : "Normal"}
                  </span>
                </td>

                <td>
                  {row.actions?.canScheduleMaintenance && (
                    <button className="outlineBtn">Schedule Maintenance</button>
                  )}

                  {row.actions?.canTriggerOverflowAlert && (
                    <button className="outlineBtn">Trigger Alert</button>
                  )}

                  {row.actions?.canViewDetail && (
                    <button className="ghostBtn">View</button>
                  )}

                  {row.actions?.canExport && (
                    <button className="ghostBtn">Export</button>
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

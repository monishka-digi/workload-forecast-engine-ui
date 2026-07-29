import InfoTooltip from "../../../components/Common/InfoTooltip";
import useDashboardFilters from "../../../context/useDashboardFilters";
import { filterRowsByBranch } from "../../../utils/branchFilters";

import "./BranchLoadGauge.css";

export default function BranchLoadGauge({
  data = [],
  selectedBranch = "ALL",
  forecastDays = 30,
}) {
  const { branchOptions } = useDashboardFilters();

  const scopedData =
    selectedBranch === "ALL"
      ? data
      : filterRowsByBranch(data, selectedBranch);

  const rows = [...(scopedData.length ? scopedData : data)].sort(
    (left, right) => Number(right.load ?? 0) - Number(left.load ?? 0),
  );

  const averageLoad = rows.length
    ? rows.reduce((sum, item) => sum + Number(item.load ?? 0), 0) / rows.length
    : 0;

  const branchLabel =
    selectedBranch === "ALL"
      ? "All Branches"
      : branchOptions.find((option) => option.value === selectedBranch)?.label ??
        selectedBranch;

  return (
    <div className="branchGaugeCard">
      <div className="branchGaugeHeader">
        <div className="branchGaugeTitleGroup">
          <h3>Branch Load by Branch</h3>

          <InfoTooltip
            position="bottom"
            content="This chart shows the predicted load percentage for each branch across the selected horizon. It mirrors the bay utilization view so you can compare branch pressure at a glance."
          >
            <span className="infoIcon">i</span>
          </InfoTooltip>
        </div>

        <span>
          {branchLabel} | Avg {averageLoad.toFixed(1)}% | {forecastDays} Days
        </span>
      </div>

      <div className="branchGaugeBody">
        {rows.map((item) => (
          <div key={item.id} className="gaugeRow">
            <div className="gaugeInfo">
              <h4>{item.branch}</h4>
              <p>
                {item.geography} | {Math.ceil(Number(item.jobs ?? 0))} jobs |{" "}
                {item.capacity} bays
              </p>
            </div>

            <div className="gaugeBarContainer">
              <div className="gaugeTrack">
                <div
                  className={`gaugeFill ${
                    item.load >= 90
                      ? "danger"
                      : item.load >= 75
                        ? "warning"
                        : "normal"
                  }`}
                  style={{
                    width: `${Math.min(Number(item.load ?? 0), 100)}%`,
                  }}
                />
              </div>

              <span
                className={
                  item.load >= 90
                    ? "dangerText"
                    : item.load >= 75
                      ? "warningText"
                      : "normalText"
                }
              >
                {Number(item.load ?? 0).toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

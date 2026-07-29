import { useMemo } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { Doughnut } from "react-chartjs-2";
import InfoTooltip from "../../../components/Common/InfoTooltip";
import useDashboardFilters from "../../../context/useDashboardFilters";
import { filterRowsByBranch } from "../../../utils/branchFilters";
import { buildBranchColorMap, getBranchColor } from "../../../utils/branchColors";

ChartJS.register(ArcElement, Tooltip, Legend);

import "./BranchLoadGauge.css";

export default function BranchLoadGauge({
  data = [],
  selectedBranch = "ALL",
}) {
  const { branchOptions } = useDashboardFilters();
  const scopedData =
    selectedBranch === "ALL"
      ? data
      : filterRowsByBranch(data, selectedBranch);
  const rows = scopedData.length ? scopedData : data;

  const colorMap = useMemo(
    () => buildBranchColorMap(branchOptions, rows.map((item) => item.id)),
    [branchOptions, rows],
  );

  const backgroundColors = rows.map((item) => getBranchColor(item.id, colorMap));

  const chartData = {
    labels: rows.map((x) => x.branch),

    datasets: [
      {
        data: rows.map((x) => x.load),

        backgroundColor: backgroundColors,
        hoverBackgroundColor: backgroundColors,

        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="branchGaugeCard">
      <div className="branchGaugeHeader">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <h3>Branch Load Gauge</h3>

          <InfoTooltip
            position="bottom"
            content="Shows relative share of overall workload/demand split between Nagpur and Chennai branches, giving a quick at-a-glance view of which branch is carrying more of the total load."
          >
            <span className="infoIcon">i</span>
          </InfoTooltip>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          flex: 1,
          minHeight: 0,
        }}
      >
        <div className="branchGaugeBody">
          <div
            style={{
              width: "100%",
              maxWidth: 420,
              aspectRatio: "1 / 1",
            }}
          >
            <Doughnut
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: "58%",

                plugins: {
                  legend: {
                    position: "right",
                    align: "center",

                    labels: {
                      boxWidth: 16,
                      boxHeight: 16,
                      padding: 14,
                      usePointStyle: false,
                      color: "var(--text)",
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

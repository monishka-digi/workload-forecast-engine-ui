import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { useTheme } from "../../../context/ThemeContext";
import { getChartColors } from "../../../config/chartOptions";
import "./BranchLoadTrendChart.css";
import InfoTooltip from "../../../components/Common/InfoTooltip";
import { isAllBranches } from "../../../utils/branchFilters";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

export default function BranchLoadTrendChart({ chart, selectedBranch = "ALL" }) {
  const { theme } = useTheme();
  const colors = getChartColors(theme);
  const branchFilteredChart = useMemo(() => {
    if (isAllBranches(selectedBranch) || !chart?.branchIds) {
      return chart;
    }

    const matchingIndices = chart.branchIds
      .map((branchId, index) => (branchId === selectedBranch ? index : -1))
      .filter((index) => index >= 0);

    if (!matchingIndices.length) return chart;

    return {
      ...chart,
      labels: matchingIndices.map((index) => chart.labels[index]),
      branchIds: matchingIndices.map((index) => chart.branchIds[index]),
      periodDates: Array.isArray(chart.periodDates)
        ? matchingIndices.map((index) => chart.periodDates[index])
        : chart.periodDates,
      datasets: chart.datasets.map((dataset) => ({
        ...dataset,
        data: matchingIndices.map((index) => dataset.data[index]),
      })),
    };
  }, [chart, selectedBranch]);

  return (
    <div className="branchTrendCard">
      <div className="branchTrendHeader">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <h3>Load trend — breach branches</h3>

          <InfoTooltip
            position="bottom"
            content="Tracks forecasted vs. actual utilization % (Y-axis) over time specifically for branches that are flagged as breaching capacity thresholds. This shows forecasts accuracy for the branches most at risk of capacity breach"
          >
            <span className="infoIcon">i</span>
          </InfoTooltip>
        </div>

        <span>forecast vs actual</span>
      </div>

      <div className="branchTrendBody">
        <Line
          data={branchFilteredChart}
          options={{
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
              legend: {
                position: "top",
                align: "end",

                labels: {
                  color: colors.text,
                  boxWidth: 14,
                },
              },
              tooltip: {
                backgroundColor: colors.tooltipBg,
                borderColor: colors.tooltipBorder,
                borderWidth: 1,
                titleColor: colors.tooltipText,
                bodyColor: colors.tooltipText,
              },
            },

            interaction: {
              intersect: false,
              mode: "index",
            },

            scales: {
              x: {
                title: {
                  display: true,
                  text: "Time",
                  color: colors.text,
                  font: {
                    size: 12,
                    weight: 600,
                  },
                },
                ticks: {
                  color: colors.muted,
                },

                grid: {
                  color: colors.grid,
                },
              },

              y: {
                title: {
                  display: true,
                  text: "Load %",
                  color: colors.text,
                  font: {
                    size: 12,
                    weight: 600,
                  },
                },
                ticks: {
                  color: colors.muted,
                  callback: (v) => `${v}%`,
                },

                grid: {
                  color: colors.grid,
                },

                min: 0,
              },
            },
          }}
        />
      </div>
    </div>
  );
}

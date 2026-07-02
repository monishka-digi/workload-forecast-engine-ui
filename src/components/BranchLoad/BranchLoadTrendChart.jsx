import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";
import { useTheme } from "../../context/ThemeContext";
import { getChartColors } from "../../config/chartOptions";
import "./BranchLoadTrendChart.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function BranchLoadTrendChart({ chart }) {
  const { theme } = useTheme();
  const colors = getChartColors(theme);

  return (
    <div className="branchTrendCard">
      <div className="branchTrendHeader">
        <h3>Load trend — breach branches</h3>

        <span>forecast vs actual</span>
      </div>

      <div className="branchTrendBody">
        <Line
          data={chart}
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
                ticks: {
                  color: colors.muted,
                },

                grid: {
                  color: colors.grid,
                },
              },

              y: {
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
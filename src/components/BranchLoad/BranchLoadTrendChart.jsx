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
                  color: "#d9dce5",
                  boxWidth: 14,
                },
              },
            },

            interaction: {
              intersect: false,
              mode: "index",
            },

            scales: {
              x: {
                ticks: {
                  color: "#7b879d",
                },

                grid: {
                  color: "#222b39",
                },
              },

              y: {
                ticks: {
                  color: "#7b879d",
                  callback: (v) => `${v}%`,
                },

                grid: {
                  color: "#222b39",
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
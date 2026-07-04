import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { Doughnut } from "react-chartjs-2";
import InfoTooltip from "../Common/Tooltip/InfoTooltip";

ChartJS.register(ArcElement, Tooltip, Legend);

import "./BranchLoadGauge.css";

export default function BranchLoadGauge({ data }) {
  const chartData = {
    labels: data.map((x) => x.branch),

    datasets: [
      {
        data: data.map((x) => x.load),

        backgroundColor: [
          "#12BE83",
          "#D8DEE9",
          // "#12BE83",
          // "#1CC88A",
          // "#36D399",
          // "#7BDCB5",
          // "#FFD54F",
          // "#FFB300",
          // "#FF8A65",
          // "#EF5350",
          // "#AB47BC",
        ],

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
          height: "320px",
        }}
      >
        <div
          style={{
            width: 290,
            height: 290,
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
  );
}

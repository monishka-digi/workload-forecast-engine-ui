import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { Doughnut } from "react-chartjs-2";

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
          "#1CC88A",
          "#36D399",
          "#7BDCB5",
          "#FFD54F",
          "#FFB300",
          "#FF8A65",
          "#EF5350",
          "#AB47BC",
        ],

        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="branchGaugeCard">
      <div className="branchGaugeHeader">
        <h3>Branch Load Gauge</h3>
      </div>

      <div
        style={{
          width: "450px",
          height: "450px",
          margin: "0 auto",
        }}
      >
        <Doughnut
          data={chartData}
          options={{
            responsive: true,

            maintainAspectRatio: false,

            plugins: {
              legend: {
                position: "right",
              },
            },
          }}
        />
      </div>
    </div>
  );
}

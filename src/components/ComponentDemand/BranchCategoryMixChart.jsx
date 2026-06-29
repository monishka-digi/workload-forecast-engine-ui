import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import Card from "../Common/Card";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BranchCategoryMixChart({ data }) {
  if (!data) return null;

  console.log(data);

  const options = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "bottom",

        labels: {
          color: "#b8c1d1",

          boxWidth: 14,

          padding: 18,
        },
      },

      tooltip: {
        mode: "index",

        intersect: false,
      },
    },

    interaction: {
      mode: "index",

      intersect: false,
    },

    scales: {
      x: {
        stacked: true,

        ticks: {
          color: "#a8b2c7",
        },

        grid: {
          display: false,
        },
      },

      y: {
        stacked: true,

        ticks: {
          color: "#a8b2c7",
        },

        grid: {
          color: "#2b3445",
        },
      },
    },
  };

  return (
    <Card title="Branch × Category Mix" tag="stacked">
      <div
        style={{
          height: 320,
        }}
      >
        <Bar data={data} options={options} />
      </div>
    </Card>
  );
}

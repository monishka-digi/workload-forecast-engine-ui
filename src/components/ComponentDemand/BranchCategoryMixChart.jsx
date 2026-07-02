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
import { useTheme } from "../../context/ThemeContext";
import { getChartColors } from "../../config/chartOptions";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BranchCategoryMixChart({ data }) {
  const { theme } = useTheme();
  const colors = getChartColors(theme);
  
  if (!data) return null;

  const options = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "bottom",

        labels: {
          color: colors.text,

          boxWidth: 14,

          padding: 18,
        },
      },

      tooltip: {
        mode: "index",

        intersect: false,
        backgroundColor: colors.tooltipBg,
        borderColor: colors.tooltipBorder,
        borderWidth: 1,
        titleColor: colors.tooltipText,
        bodyColor: colors.tooltipText,
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
          color: colors.muted,
        },

        grid: {
          display: false,
        },
      },

      y: {
        stacked: true,

        ticks: {
          color: colors.muted,
        },

        grid: {
          color: colors.grid,
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

import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import Card from "../../../components/Common/Card";
import { useTheme } from "../../../context/ThemeContext";
import { getChartColors } from "../../../config/chartOptions";
import InfoTooltip from "../../../components/Common/InfoTooltip";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BranchCategoryMixChart({ data }) {
  const { theme } = useTheme();
  const colors = getChartColors(theme);
  const chartTitleStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "20px",
    fontWeight: 700,
    color: "var(--text)",
    lineHeight: 1.2,
  };

  if (!data) return null;

  console.log("Branch Category Mix:", data);

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
    <Card
      title={
        <div style={chartTitleStyle}>
          <span style={chartTitleStyle}>Branch x Category Mix</span>
          <InfoTooltip
            position="bottom"
            content="Shows predicted parts demand broken down by component category for each branch"
          >
            <span className="infoIcon">i</span>
          </InfoTooltip>
        </div>
      }
      tag="Stacked Forecast"
      height="350px"
    >
      <div
        style={{
          flex: 1,
          position: "relative",
          minHeight: 0,
        }}
      >
        <Bar data={data} options={options} />
      </div>
    </Card>
  );
}

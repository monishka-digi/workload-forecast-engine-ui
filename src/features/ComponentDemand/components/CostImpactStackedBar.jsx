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
import "../../JobVolume/components/dashboardChartCard.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function CostImpactStackedBar({ data }) {
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
        title: {
          display: true,
          text: "Period",
          color: colors.text,
          font: {
            size: 12,
            weight: 600,
          },
        },
        ticks: {
          color: colors.muted,
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 11,
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: "Cost Impact",
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
    },
  };

  return (
    <Card
      title={
        <div style={chartTitleStyle}>
          <span style={chartTitleStyle}>Cost Impact Over Time</span>
          <InfoTooltip
            position="bottom"
            content="Historical cost impact by category. Categories with no matched unit_cost data reflect quantity, not a validated cost figure — see data quality notes"
          >
            <span className="infoIcon">i</span>
          </InfoTooltip>
        </div>
      }
      tag="By Category"
      height="clamp(340px, 36vw, 430px)"
    >
      <div className="dashboardChartCard__body">
        <div className="dashboardChartCard__chartShell">
          <Bar data={data} options={options} />
        </div>
      </div>
    </Card>
  );
}

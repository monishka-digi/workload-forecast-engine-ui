import { useMemo } from "react";
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

  const labelCount = data.labels?.length || 0;
  const isSingleBranch = labelCount <= 1;
  const datasetOptions = {
    categoryPercentage: isSingleBranch ? 0.38 : labelCount <= 3 ? 0.58 : 0.72,
    barPercentage: isSingleBranch ? 0.55 : labelCount <= 3 ? 0.75 : 0.9,
    maxBarThickness: isSingleBranch ? 22 : 42,
  };

  const options = useMemo(
    () => ({
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
      datasets: {
        bar: datasetOptions,
      },
      scales: {
        x: {
          stacked: true,
          title: {
            display: true,
            text: "Branches",
            color: colors.text,
            font: {
              size: 12,
              weight: 600,
            },
          },
          ticks: {
            color: colors.muted,
            autoSkip: false,
            maxRotation: 90,
            minRotation: 90,
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
            text: "Quantity",
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
    }),
    [colors, datasetOptions],
  );

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

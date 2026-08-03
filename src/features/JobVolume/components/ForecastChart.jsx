import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";

import { Line } from "react-chartjs-2";
import { getCommonOptions } from "../../../config/chartOptions";
import { useTheme } from "../../../context/ThemeContext";
import InfoTooltip from "../../../components/Common/InfoTooltip";
import "./dashboardChartCard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  annotationPlugin
);

export default function ForecastChart({ data }) {
  const { theme } = useTheme();

  if (!data) return null;
  const options = getCommonOptions(theme);
  options.scales.y.title = {
    display: true,
    text: "Jobs",
  };
  options.scales.y.suggestedMax = data.suggestedMax;
  options.plugins.legend.labels.filter = (legendItem, chartData) => {
    const role = chartData.datasets[legendItem.datasetIndex]?.chartRole;
    return role === "historicalPrediction" || role === "actual";
  };
  options.plugins.tooltip = {
    ...options.plugins.tooltip,
    filter: (tooltipItem) => {
      const point = data.points?.[tooltipItem.dataIndex];
      const role = tooltipItem.dataset.chartRole;

      return (
        (role === "historicalPrediction" && !point?.isForecast) ||
        (role === "forecastPrediction" && point?.isForecast)
      );
    },
    callbacks: {
      title: (items) => items[0]?.label ?? "",
      label: (context) => {
        const point = data.points?.[context.dataIndex];
        if (!point) return "";

        const formatValue = (value) =>
          value === null || value === undefined ? "N/A" : Number(value);

        if (point.isForecast) {
          return [
            `Forecast Jobs: ${formatValue(point.prediction)} jobs`,
            `Lower Bound (P10): ${formatValue(point.p10)}`,
            `Upper Bound (P90): ${formatValue(point.p90)}`,
          ];
        }

        const variance = Number(point.actual ?? 0) - Number(point.prediction ?? 0);
        const varianceLabel = `${variance >= 0 ? "+" : ""}${variance}`;
        return [
          `Prediction: ${formatValue(point.prediction)}`,
          `Actual: ${formatValue(point.actual)}`,
          `Variance: ${varianceLabel}`,
        ];
      },
    },
  };

  if (data.forecastStartIndex > -1) {
    options.plugins = {
      ...options.plugins,
      annotation: {
        annotations: {
          forecastRegion: {
            type: "box",
            xMin: data.forecastStartIndex,
            xMax: data.labels.length - 1,
            backgroundColor:
              theme === "dark" ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)",
            borderWidth: 0,
          },
          forecastStartLine: {
            type: "line",
            xMin: data.forecastStartIndex,
            xMax: data.forecastStartIndex,
            borderColor: theme === "dark" ? "#888" : "#555",
            borderWidth: 1.5,
            borderDash: [6, 4],
            label: {
              display: true,
              content: "Forecast starts",
              position: "end",
              backgroundColor: theme === "dark" ? "#333" : "#f5f5f5",
              color: theme === "dark" ? "#fff" : "#333",
              font: { size: 10 },
              yAdjust: 18,
            },
          },
        },
      },
    };
  }

  return (
    <div className="dashboardChartCard">
      <div className="dashboardChartCard__top">
        <div className="dashboardChartCard__titleGroup">
          <h3 className="dashboardChartCard__title">Job Demand Trend</h3>
          <InfoTooltip
            position="bottom"
            content="Historical actuals and model predictions are shown separately. The dashed divider marks the forecast start, with the shaded area showing the future P10-P90 prediction range."
          >
            <span className="infoIcon">i</span>
          </InfoTooltip>
        </div>
      </div>

      <div className="dashboardChartCard__body">
        <div className="dashboardChartCard__chartShell">
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
}

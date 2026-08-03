import { useMemo } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import { Line } from "react-chartjs-2";

import Card from "../../../components/Common/Card";
import { useTheme } from "../../../context/ThemeContext";
import { getCommonOptions } from "../../../config/chartOptions";
import InfoTooltip from "../../../components/Common/InfoTooltip";
import { getForecastStartIndex } from "../../../utils/forecastChartUtils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  annotationPlugin,
);

const splitDataset = (dataset, forecastStartIndex) => {
  const actualLabel = `${dataset.label} (Actual)`;
  const forecastLabel = `${dataset.label} (Forecast)`;
  const forecastColor =
    dataset.label === "Required"
      ? "#3b82f6"
      : dataset.label === "Available"
        ? "#8b5cf6"
        : "#3b82f6";

  return [
    {
      ...dataset,
      label: actualLabel,
      data: dataset.data.map((value, index) => (index < forecastStartIndex ? value : null)),
      borderDash: undefined,
      fill: Boolean(dataset.fill),
    },
    {
      ...dataset,
      label: forecastLabel,
      data: dataset.data.map((value, index) => (index >= forecastStartIndex ? value : null)),
      borderColor: forecastColor,
      backgroundColor: forecastColor,
      borderDash: [6, 4],
      fill: false,
    },
  ];
};

export default function HeadcountTrendChart({ data }) {
  const { theme } = useTheme();

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

  const forecastStartIndex = useMemo(
    () =>
      getForecastStartIndex({
        periodDates: data.periodDates,
        currentDateMarker: data.current_date_marker,
        forecastFlags: data.forecastFlags,
      }),
    [data.periodDates, data.current_date_marker, data.forecastFlags],
  );

  const chartData = useMemo(() => {
    if (forecastStartIndex < 0) return data;

    return {
      ...data,
      datasets: data.datasets.flatMap((dataset) =>
        splitDataset(dataset, forecastStartIndex),
      ),
    };
  }, [data, forecastStartIndex]);

  const options = {
    ...getCommonOptions(theme),
    plugins: {
      ...getCommonOptions(theme).plugins,
      legend: {
        position: "top",
        align: "start",
      },
      annotation:
        forecastStartIndex < 0
          ? undefined
          : {
              annotations: {
                forecastStartLine: {
                  type: "line",
                  xMin: forecastStartIndex,
                  xMax: forecastStartIndex,
                  borderColor: theme === "dark" ? "#888" : "#555",
                  borderWidth: 1.5,
                  borderDash: [6, 4],
                  label: {
                    display: true,
                    content: "Forecast starts",
                    position: "start",
                    backgroundColor: theme === "dark" ? "#333" : "#f5f5f5",
                    color: theme === "dark" ? "#fff" : "#333",
                    font: { size: 10 },
                    yAdjust: -10,
                  },
                },
              },
            },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: "Technicians",
        },
      },
    },
  };

  return (
    <Card
      title={
        <div style={chartTitleStyle}>
          <span style={chartTitleStyle}>Headcount Requirement Trend</span>

          <InfoTooltip
            position="bottom"
            content="Weekly required vs available technicians as returned by the backend for the selected range."
          >
            <span className="infoIcon">i</span>
          </InfoTooltip>
        </div>
      }
      tag="Technician Demand"
      height="320px"
    >
      <div className="trendChartWrapper">
        <Line data={chartData} options={options} />
      </div>
    </Card>
  );
}

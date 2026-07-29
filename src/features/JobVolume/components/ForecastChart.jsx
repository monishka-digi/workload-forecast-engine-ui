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

  // Find the index of the last non-null point in the "Actual" dataset.
  // Assumes one dataset is labeled/identifiable as actual data.
  const actualDataset = data.datasets.find((ds) => ds.label === "Actual");

  let lastActualIndex = -1;
  if (actualDataset) {
    for (let i = actualDataset.data.length - 1; i >= 0; i--) {
      if (actualDataset.data[i] !== null && actualDataset.data[i] !== undefined) {
        lastActualIndex = i;
        break;
      }
    }
  }

  if (lastActualIndex > -1) {
    options.plugins = {
      ...options.plugins,
      annotation: {
        annotations: {
          forecastStartLine: {
            type: "line",
            xMin: lastActualIndex,
            xMax: lastActualIndex,
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
    };
  }

  return (
    <div className="dashboardChartCard">
      <div className="dashboardChartCard__top">
        <div className="dashboardChartCard__titleGroup">
          <h3 className="dashboardChartCard__title">Job Demand Trend</h3>
          <InfoTooltip
            position="bottom"
            content="Forecasted vs. actual job volume over time. Actual values are shown only where historical data exists, while the forecast extends across the entire prediction horizon. This chart helps compare predicted workload against actual job counts week over week."
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
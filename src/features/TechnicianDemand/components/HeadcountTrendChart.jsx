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

import { Line } from "react-chartjs-2";

import Card from "../../../components/Common/Card";
import { useTheme } from "../../../context/ThemeContext";
import { getCommonOptions } from "../../../config/chartOptions";
import InfoTooltip from "../../../components/Common/InfoTooltip";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
);

export default function HeadcountTrendChart({ data }) {
  const { theme } = useTheme();
  const horizonDays = data?.forecastHorizonDays || 90;

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
    ...getCommonOptions(theme),
    plugins: {
      ...getCommonOptions(theme).plugins,
      legend: {
        position: "top",
        align: "start",
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
            content={`Weekly required vs available technicians over the next ${horizonDays} days. The gap widens during the monsoon surge and stays elevated.`}
          >
            <span className="infoIcon">i</span>
          </InfoTooltip>
        </div>
      }
      tag="Technician Demand"
      height="320px"
    >
      <div className="trendChartWrapper">
        <Line data={data} options={options} />
      </div>
    </Card>
  );
}

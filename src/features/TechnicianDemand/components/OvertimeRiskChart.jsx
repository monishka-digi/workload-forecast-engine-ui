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
import "./OvertimeRiskChart.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
);

export default function OvertimeRiskChart({ data }) {
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
        beginAtZero: true,
        title: {
          display: true,
          text: "Overtime %",
        },
      },
    },
  };

  return (
    <Card
      title={
        <div style={chartTitleStyle}>
          <span style={chartTitleStyle}>Overtime Risk</span>

          <InfoTooltip
            position="bottom"
            content="Daily overtime utilization against the alert threshold. Spikes above the dashed line flag days worth investigating."
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

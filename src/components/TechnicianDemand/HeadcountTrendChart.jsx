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

import Card from "../Common/Card";
import { useTheme } from "../../context/ThemeContext";
import { getCommonOptions } from "../../config/chartOptions";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

export default function HeadcountTrendChart({ data }) {
  const { theme } = useTheme();

  if (!data) return null;

  return (
    <Card
      title="Headcount Requirement Trend"
      tag="Required vs Available"
      height="320px"
    >
      <div className="trendChartWrapper">
        <Line
          data={data}
          options={{
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
              },
            },
          }}
        />
      </div>
    </Card>
  );
}
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from "chart.js";

import { Line } from "react-chartjs-2";
import { getCommonOptions } from "../../config/chartOptions";
import { useTheme } from "../../context/ThemeContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);

export default function ForecastChart({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  return (
    <div
      style={{
        height: 350,
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: 20,
      }}
    >
      <Line
        data={data}
        options={getCommonOptions(theme)}
      />
    </div>
  );
}
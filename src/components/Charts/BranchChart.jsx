import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

import Card from "../Common/Card";
import { getHorizontalBarOptions } from "../../config/chartOptions";
import { useTheme } from "../../context/ThemeContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BranchChart({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  return (
    <Card title="Branch Wise Workload Forecast" tag="Predicted Jobs" height="auto">
      <div
        style={{
          height: 320,
          width: "100%",
          position: "relative",
          background: "var(--card-bg)",
        }}
      >
        <Bar data={data} options={getHorizontalBarOptions(theme)} />
      </div>
    </Card>
  );
}

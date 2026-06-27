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
import { horizontalBarOptions } from "../../config/chartOptions";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BranchChart({ data }) {
  if (!data) return null;

  return (
    <Card title="Jobs by Branch" tag="Predicted Jobs" height="380px">
      <div
        style={{
          height: 320,
          width: "100%",
          position: "relative",
          background: "#222",
        }}
      >
        <Bar data={data} options={horizontalBarOptions} />
      </div>
    </Card>
  );
}

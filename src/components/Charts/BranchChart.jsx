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
import InfoTooltip from "../Common/Tooltip/InfoTooltip";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BranchChart({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const chartTitleStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "20px",
    fontWeight: 700,
    color: "var(--text)",
    lineHeight: 1.2,
  };

  return (
    <Card
      title={
        <div style={chartTitleStyle}>
          <span style={chartTitleStyle}>Branch Wise Workload Forecast</span>

          <InfoTooltip
            position="bottom"
            content="Total predicted job volume compared across branches."
          >
            <span className="infoIcon">i</span>
          </InfoTooltip>
        </div>
      }
      height="350px"
    >
      <div
        style={{
          flex: 1,
          position: "relative",
          minHeight: 0,
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

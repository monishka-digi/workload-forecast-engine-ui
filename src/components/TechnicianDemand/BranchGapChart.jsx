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
import { useTheme } from "../../context/ThemeContext";
import { getGroupedHorizontalBarOptions } from "../../config/chartOptions";
import InfoTooltip from "../Common/Tooltip/InfoTooltip";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BranchGapChart({ data, summary = [] }) {
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

  return (
    <Card
      title={
        <div style={chartTitleStyle}>
          <span style={chartTitleStyle}>Branch Headcount Gap</span>

          <InfoTooltip
            position="bottom"
            content="Required vs available technicians by branch — Nagpur carries the larger shortfall (29.4%) versus Chennai's near-balanced 6.8% gap"
          >
            <span className="infoIcon">i</span>
          </InfoTooltip>
        </div>
      }
      tag="Technician Demand"
      height="320px"
    >
      <div className="branchGapChartWrapper">
        <Bar data={data} options={getGroupedHorizontalBarOptions(theme)} />
      </div>

      <div className="branchGapSummary">
        {summary.map((item) => (
          <div key={item.branch} className="branchGapItem">
            <p>{item.branch}</p>

            <h3 className={item.gap > 5 ? "danger" : "warning"}>
              -{item.gap} ({item.gapPct})
            </h3>
          </div>
        ))}
      </div>
    </Card>
  );
}

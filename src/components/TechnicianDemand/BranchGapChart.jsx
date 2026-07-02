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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function BranchGapChart({
  data,
  summary = [],
}) {
  const { theme } = useTheme();

  if (!data) return null;

  return (
    <Card
      title="Branch Headcount Gap"
      tag="Required vs Available"
      height="320px"
    >
      <div className="branchGapChartWrapper">
        <Bar
          data={data}
          options={getGroupedHorizontalBarOptions(theme)}
        />
      </div>

      <div className="branchGapSummary">
        {summary.map((item) => (
          <div
            key={item.branch}
            className="branchGapItem"
          >
            <p>{item.branch}</p>

            <h3
              className={
                item.gap > 5
                  ? "danger"
                  : "warning"
              }
            >
              -{item.gap} ({item.gapPct})
            </h3>
          </div>
        ))}
      </div>
    </Card>
  );
}
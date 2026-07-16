import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

import Card from "../../../components/Common/Card";
import { getHorizontalBarOptions } from "../../../config/chartOptions";
import { useTheme } from "../../../context/ThemeContext";
import InfoTooltip from "../../../components/Common/InfoTooltip";
import { isAllBranches } from "../../../utils/branchFilters";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BranchChart({ data, selectedBranch = "ALL" }) {
  const { theme } = useTheme();
  if (!data) return null;
  const filteredData =
    isAllBranches(selectedBranch) || !data.branchIds
      ? data
      : (() => {
          const matchingIndices = data.branchIds
            .map((branchId, index) => (branchId === selectedBranch ? index : -1))
            .filter((index) => index >= 0);

          if (!matchingIndices.length) return data;

          return {
            ...data,
            labels: matchingIndices.map((index) => data.labels[index]),
            branchIds: matchingIndices.map((index) => data.branchIds[index]),
            datasets: data.datasets.map((dataset) => ({
              ...dataset,
              data: matchingIndices.map((index) => dataset.data[index]),
            })),
          };
        })();

  const branchCount = filteredData.labels?.length ?? 0;
  const chartHeight = Math.max(240, Math.min(720, branchCount * 36 + 56));

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
          width: "100%",
          height: "100%",
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          paddingRight: 4,
        }}
      >
        <div
          style={{
            position: "relative",
            height: chartHeight,
            minHeight: chartHeight,
            width: "100%",
          }}
        >
          <Bar data={filteredData} options={getHorizontalBarOptions(theme)} />
        </div>
      </div>
    </Card>
  );
}

import { useMemo } from "react";
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
import { useTheme } from "../../../context/ThemeContext";
import { getGroupedHorizontalBarOptions } from "../../../config/chartOptions";
import InfoTooltip from "../../../components/Common/InfoTooltip";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const filterChartByBranch = (data, selectedBranch) => {
  if (!data || selectedBranch === "ALL") return data;

  const matchingIndices = (data.branchIds || [])
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
};

export default function BranchGapChart({
  data,
  summary = [],
  selectedBranch = "ALL",
}) {
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

  const filteredData = useMemo(
    () => {
      const chart = filterChartByBranch(data, selectedBranch);

      if (!chart) {
        return chart;
      }

      return {
        ...chart,
        datasets: chart.datasets.map((dataset) => ({
          ...dataset,
          barPercentage: 0.72,
          categoryPercentage: 0.62,
          maxBarThickness: 16,
        })),
      };
    },
    [data, selectedBranch],
  );

  const filteredSummary = useMemo(() => {
    if (selectedBranch === "ALL") return summary;

    const matchingSummary = summary.filter(
      (item) => item.branchId === selectedBranch,
    );

    return matchingSummary.length ? matchingSummary : summary;
  }, [summary, selectedBranch]);

  return (
   <Card
    title={
        <div style={chartTitleStyle}>
            <span style={chartTitleStyle}>
                Branch Headcount Gap
            </span>

            <InfoTooltip
                position="bottom"
                content="Compares required technician headcount against available technicians across branches over the next 30 days."
            >
                <span className="infoIcon">i</span>
            </InfoTooltip>
        </div>
    }
    tag="Technician Demand"
    height="420px"
>
    <div
        style={{
            height:320
        }}
    >
        <Bar
            data={filteredData}
            options={getGroupedHorizontalBarOptions(theme)}
        />
    </div>
</Card>
  );
}

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";

import { getDoughnutOptions } from "../../../config/chartOptions";
import { useTheme } from "../../../context/ThemeContext";
import InfoTooltip from "../../../components/Common/InfoTooltip";
import { isAllBranches } from "../../../utils/branchFilters";
import "./dashboardChartCard.css";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function MachineMixChart({ data, selectedBranch = "ALL" }) {
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
            total: matchingIndices.reduce(
              (sum, index) => sum + Number(data.datasets[0].data[index] ?? 0),
              0,
            ),
          };
        })();

  const totalJobs = filteredData.total ?? 0;
  const sliceValuePlugin = useMemo(
    () => ({
      id: "sliceValueLabels",
      afterDatasetsDraw(chart) {
        const { ctx } = chart;
        const dataset = chart.data.datasets[0];
        const meta = chart.getDatasetMeta(0);

        if (!dataset || !meta?.data?.length) return;

        ctx.save();
        ctx.fillStyle = theme === "dark" ? "#ffffff" : "#111827";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "600 12px Inter, system-ui, sans-serif";

        meta.data.forEach((arc, index) => {
          const value = dataset.data[index];
          const numericValue = Number(value ?? 0);

          if (!numericValue) return;

          const properties = arc.getProps(
            ["x", "y", "startAngle", "endAngle", "innerRadius", "outerRadius"],
            true,
          );

          const angle = (properties.startAngle + properties.endAngle) / 2;
          const radius = properties.innerRadius + (properties.outerRadius - properties.innerRadius) * 0.58;
          const x = properties.x + Math.cos(angle) * radius;
          const y = properties.y + Math.sin(angle) * radius;

          const label = String(numericValue);
          const textWidth = ctx.measureText(label).width;
          const availableWidth = (properties.outerRadius - properties.innerRadius) * 0.9;

          if (textWidth > availableWidth) return;

          ctx.fillText(label, x, y);
        });

        ctx.restore();
      },
    }),
    [theme],
  );

  return (
    <div className="dashboardChartCard">
      <div className="dashboardChartCard__top">
        <div className="dashboardChartCard__titleGroup">
          <h3 className="dashboardChartCard__title">Machine Type Mix</h3>

          <InfoTooltip
            position="bottom"
            content="Breakdown of predicted job volume by machine type, showing which equipment categories will drive the most service demand."
          >
            <span className="infoIcon">i</span>
          </InfoTooltip>
        </div>

        <span className="dashboardChartCard__meta">Total Jobs: {totalJobs}</span>
      </div>

      <div className="dashboardChartCard__body">
        <div className="dashboardChartCard__chartShell">
          <Doughnut
            data={filteredData}
            options={getDoughnutOptions(theme)}
            plugins={[sliceValuePlugin]}
          />
        </div>
      </div>
    </div>
  );
}

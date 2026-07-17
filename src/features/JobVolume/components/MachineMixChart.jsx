import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

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
          <Doughnut data={filteredData} options={getDoughnutOptions(theme)} />
        </div>
      </div>
    </div>
  );
}

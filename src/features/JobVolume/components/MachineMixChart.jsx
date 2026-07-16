import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { Doughnut } from "react-chartjs-2";

import Card from "../../../components/Common/Card";
import { getDoughnutOptions } from "../../../config/chartOptions";
import { useTheme } from "../../../context/ThemeContext";
import InfoTooltip from "../../../components/Common/InfoTooltip";
import { isAllBranches } from "../../../utils/branchFilters";

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
              <span style={chartTitleStyle}>Machine Type Mix</span>
    
              <InfoTooltip
                position="bottom"
                content="Breakdown of predicted job volume by machine type, showing which equipment categories will drive the most service demand."
              >
                <span className="infoIcon">i</span>
              </InfoTooltip>
            </div>
          }
          height="350px"
        >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "380px",
          height: "280px",
          margin: "20px auto",
        }}
      >
        <Doughnut data={filteredData} options={getDoughnutOptions(theme)} />

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              margin: 0,
              lineHeight: 1,
              color: "var(--text)",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            {filteredData.total}
          </h2>

          <span
            style={{
              marginTop: 6,
              color: "var(--text-secondary)",
              fontSize: 14,
            }}
          >
            Jobs
          </span>
        </div>
      </div>
    </Card>
  );
}

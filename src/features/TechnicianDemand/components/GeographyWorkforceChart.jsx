import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { useMemo } from "react";
import { Bar } from "react-chartjs-2";

import Card from "../../../components/Common/Card";
import { useTheme } from "../../../context/ThemeContext";
import { getGroupedHorizontalBarOptions } from "../../../config/chartOptions";
import InfoTooltip from "../../../components/Common/InfoTooltip";
import "../../JobVolume/components/dashboardChartCard.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function GeographyWorkforceChart({ data }) {
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

  const options = useMemo(() => getGroupedHorizontalBarOptions(theme), [theme]);

  if (!data) return null;

  return (
    <Card
      title={
        <div style={chartTitleStyle}>
          <span style={chartTitleStyle}>Workforce by Region</span>

          <InfoTooltip
            position="bottom"
            content="Required vs available technician headcount rolled up by geography zone."
          >
            <span className="infoIcon">i</span>
          </InfoTooltip>
        </div>
      }
      tag="Technician Demand"
      height="clamp(320px, 34vw, 400px)"
    >
      <div className="dashboardChartCard__body">
        <div className="dashboardChartCard__chartShell">
          <Bar data={data} options={options} />
        </div>
      </div>
    </Card>
  );
}

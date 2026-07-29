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

export default function BranchHeadcountGapChart({ data }) {
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

  const options = useMemo(() => {
    const baseOptions = getGroupedHorizontalBarOptions(theme);

    return {
      ...baseOptions,
      interaction: {
        mode: "nearest",
        intersect: true,
      },
      plugins: {
        ...baseOptions.plugins,
        tooltip: {
          ...baseOptions.plugins.tooltip,
          mode: "nearest",
          intersect: true,
        },
      },
    };
  }, [theme]);

  if (!data) return null;

  return (
    <Card
      title={
        <div style={chartTitleStyle}>
          <span style={chartTitleStyle}>Required vs Available by Branch</span>

          <InfoTooltip
            position="bottom"
            content="Compares required technician headcount against currently available staff at each branch over the selected forecast horizon."
          >
            <span className="infoIcon">i</span>
          </InfoTooltip>
        </div>
      }
      tag="Technician Demand"
      height="clamp(390px, 40vw, 480px)"
    >
      <div className="dashboardChartCard__body">
        <div className="dashboardChartCard__chartShell">
          <Bar data={data} options={options} />
        </div>
      </div>
    </Card>
  );
}

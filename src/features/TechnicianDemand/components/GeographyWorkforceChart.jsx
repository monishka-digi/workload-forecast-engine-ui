import { useMemo } from "react";
import { Bar } from "react-chartjs-2";

import { getGroupedHorizontalBarOptions } from "../../../config/chartOptions";
import Card from "../../../components/Common/Card";
import InfoTooltip from "../../../components/Common/InfoTooltip";
import { useTheme } from "../../../context/ThemeContext";
import "../../JobVolume/components/dashboardChartCard.css";

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
  const hoverOptions = useMemo(
    () => ({
      ...options,
      interaction: {
        mode: "index",
        intersect: false,
        axis: "y",
      },
      hover: {
        mode: "index",
        intersect: false,
        axis: "y",
      },
    }),
    [options],
  );

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
          <Bar data={data} options={hoverOptions} />
        </div>
      </div>
    </Card>
  );
}

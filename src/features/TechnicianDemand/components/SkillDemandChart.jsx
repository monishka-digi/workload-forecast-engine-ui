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

export default function SkillDemandChart({ data }) {
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
          <span style={chartTitleStyle}>Required vs Available by Skill</span>

          <InfoTooltip
            position="bottom"
            content="Compares required technician headcount against currently available staff by skill level over the next 30 days. L1 has a small surplus, while L2, L3, and Specialist levels face growing shortfalls"
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
          height: 320,
        }}
      >
        <Bar data={data} options={getGroupedHorizontalBarOptions(theme)} />
      </div>
    </Card>
  );
}

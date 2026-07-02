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

export default function SkillDemandChart({ data }) {
  const { theme } = useTheme();

  if (!data) return null;

  return (
    <Card
      title="Required vs Available by Skill"
      tag="technicians_required"
      height="420px"
    >
      <div
        style={{
          height: 320,
        }}
      >
        <Bar
          data={data}
          options={getGroupedHorizontalBarOptions(theme)}
        />
      </div>
    </Card>
  );
}
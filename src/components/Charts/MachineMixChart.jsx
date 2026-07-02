import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { Doughnut } from "react-chartjs-2";

import Card from "../Common/Card";
import { getDoughnutOptions } from "../../config/chartOptions";
import { useTheme } from "../../context/ThemeContext";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function MachineMixChart({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  return (
    <Card title="Machine Type Mix" tag="Predicted Jobs" height="420px">
      <div
        style={{
          height: 320,
          width: "100%",
          position: "relative",
          background: "var(--card-bg)",
        }}
      >
        <Doughnut data={data} options={getDoughnutOptions(theme)} />

        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-190%, -50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
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
            {data.total}
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

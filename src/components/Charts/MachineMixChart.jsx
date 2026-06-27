import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { Doughnut } from "react-chartjs-2";

import Card from "../Common/Card";
import { doughnutOptions } from "../../config/chartOptions";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function MachineMixChart({ data }) {
  if (!data) return null;

  return (
    <Card title="Machine Type Mix" tag="Predicted Jobs" height="420px">
      <div
        style={{
          height: 320,
          width: "100%",
          position: "relative",
          background: "#222",
        }}
      >
        <Doughnut data={data} options={doughnutOptions} />

        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%,-55%)",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#fff",
              fontSize: 30,
            }}
          >
            {data.total}
          </h2>

          <p
            style={{
              margin: 0,
              color: "#8b93a3",
              fontSize: 13,
            }}
          >
            Jobs
          </p>
        </div>
      </div>
    </Card>
  );
}

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { Doughnut } from "react-chartjs-2";

import Card from "../../../components/Common/Card";
import { getDoughnutOptions } from "../../../config/chartOptions";
import { useTheme } from "../../../context/ThemeContext";
import InfoTooltip from "../../../components/Common/InfoTooltip";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function MachineMixChart({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

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

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from "chart.js";

import { Line } from "react-chartjs-2";
import { getCommonOptions } from "../../config/chartOptions";
import { useTheme } from "../../context/ThemeContext";

import InfoTooltip from "../Common/Tooltip/InfoTooltip";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);

export default function ForecastChart({ data }) {
  const { theme } = useTheme();

  if (!data) return null;

  return (
    <div
      style={{
        height: 350,
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: 20,
        marginBottom: 10,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              color: "var(--text)",
            }}
          >
            Job Demand Trend
          </h3>

          <InfoTooltip
           position="bottom"
            content="Forecasted vs. actual job volume over time. Actual values are shown only where historical data exists, while the forecast extends across the entire prediction horizon. This chart helps compare predicted workload against actual job counts week over week."
          >
            <span className="infoIcon">i</span>
          </InfoTooltip>
        </div>
      </div>

      <div style={{ height: "280px" }}>
        <Line
          data={data}
          options={getCommonOptions(theme)}
        />
      </div>
    </div>
  );
}
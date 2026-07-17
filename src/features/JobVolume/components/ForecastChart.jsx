import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from "chart.js";

import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { getCommonOptions } from "../../../config/chartOptions";
import { useTheme } from "../../../context/ThemeContext";
import InfoTooltip from "../../../components/Common/InfoTooltip";
import useDashboardFilters from "../../../context/useDashboardFilters";
import { filterDataByPeriod } from "../../../utils/filterDataByPeriod";
import "./dashboardChartCard.css";

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
  const { forecastDays } = useDashboardFilters();

  if (!data) return null;
  const filteredData = useMemo(
    () => filterDataByPeriod(data, forecastDays, "periodDates"),
    [data, forecastDays],
  );
  const options = getCommonOptions(theme);
  options.scales.y.title = {
    display: true,
    text: "Jobs",
  };

  return (
    <div className="dashboardChartCard">
      <div className="dashboardChartCard__top">
        <div className="dashboardChartCard__titleGroup">
          <h3 className="dashboardChartCard__title">Job Demand Trend</h3>

          <InfoTooltip
            position="bottom"
            content="Forecasted vs. actual job volume over time. Actual values are shown only where historical data exists, while the forecast extends across the entire prediction horizon. This chart helps compare predicted workload against actual job counts week over week."
          >
            <span className="infoIcon">i</span>
          </InfoTooltip>
        </div>
      </div>

      <div className="dashboardChartCard__body">
        <div className="dashboardChartCard__chartShell">
        <Line data={filteredData} options={options} />
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";

import Card from "../../../components/Common/Card";
import { useTheme } from "../../../context/ThemeContext";
import { getChartColors } from "../../../config/chartOptions";
import InfoTooltip from "../../../components/Common/InfoTooltip";
import "../../JobVolume/components/dashboardChartCard.css";
import "./CategoryDemandTrendChart.css";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend, Filler);
ChartJS.register(annotationPlugin);

/**
 * @param {object} props
 * @param {{ [category]: { data, todayIndex } }} props.trendByCategory - dashboard.charts.trendByCategory
 * @param {string[]} props.categories - dashboard.charts.trendCategories
 * @param {string} props.defaultCategory - dashboard.charts.defaultTrendCategory
 */
export default function CategoryDemandTrendChart({ trendByCategory = {}, categories = [], defaultCategory }) {
  const { theme } = useTheme();
  const colors = getChartColors(theme);
  const [activeCategory, setActiveCategory] = useState(defaultCategory || categories[0]);

  // If the horizon/branch filter changes and the previously-active category
  // no longer has data (or nothing was selected yet), fall back cleanly
  // rather than rendering a blank chart.
  useEffect(() => {
    if (!categories.includes(activeCategory)) {
      setActiveCategory(defaultCategory || categories[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, defaultCategory]);

  const chartTitleStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "20px",
    fontWeight: 700,
    color: "var(--text)",
    lineHeight: 1.2,
  };

  if (categories.length === 0) return null;

  const active = trendByCategory[activeCategory];
  if (!active) return null;
  const forecastStartIndex = active.todayIndex;
  const showForecastStartLine = forecastStartIndex != null && forecastStartIndex >= 0;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: colors.text,
          boxWidth: 14,
          padding: 18,
          // P10/P90 band and the forecast-start marker have no legend
          // entries of their own — the band is context for the forecast
          // line, and the marker is explained by the guide line + label
          // the plugin draws directly on the chart.
          filter: (item) => ["Actual Qty", "Forecast Qty"].includes(item.text),
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: colors.tooltipBg,
        borderColor: colors.tooltipBorder,
        borderWidth: 1,
        titleColor: colors.tooltipText,
        bodyColor: colors.tooltipText,
        filter: (item) => ["Actual Qty", "Forecast Qty"].includes(item.dataset.label),
      },
      annotation:
        !showForecastStartLine
          ? undefined
          : {
              annotations: {
                forecastStartLine: {
                  type: "line",
                  xMin: forecastStartIndex,
                  xMax: forecastStartIndex,
                  borderColor: theme === "dark" ? "#888" : "#555",
                  borderWidth: 1.5,
                  borderDash: [6, 4],
                  label: {
                    display: true,
                    content: "Forecast starts",
                    position: "start",
                    backgroundColor: theme === "dark" ? "#333" : "#f5f5f5",
                    color: theme === "dark" ? "#fff" : "#333",
                    font: { size: 10 },
                    yAdjust: -10,
                  },
                },
              },
            },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Period",
          color: colors.text,
          font: { size: 12, weight: 600 },
        },
        ticks: { color: colors.muted, font: { size: 11 } },
        grid: { display: false },
      },
      y: {
        title: {
          display: true,
          text: "Quantity",
          color: colors.text,
          font: { size: 12, weight: 600 },
        },
        ticks: { color: colors.muted },
        grid: { color: colors.grid },
        beginAtZero: true,
      },
    },
  };

  return (
    <Card
      title={
        <div style={chartTitleStyle}>
          <span style={chartTitleStyle}>{activeCategory} Demand Trend</span>
          <InfoTooltip
            position="bottom"
            content="Actual history vs. forecast, with the P10–P90 forecast range. The marked point is where the forecast begins."
          >
            <span className="infoIcon">i</span>
          </InfoTooltip>
        </div>
      }
      tag="Actual vs Forecast"
      height="clamp(340px, 36vw, 430px)"
    >
      <div className="trendChartTabs">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`trendChartTab ${cat === activeCategory ? "trendChartTab--active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="dashboardChartCard__body">
        <div className="dashboardChartCard__chartShell">
          <Line data={active.data} options={options} />
        </div>
      </div>
    </Card>
  );
}

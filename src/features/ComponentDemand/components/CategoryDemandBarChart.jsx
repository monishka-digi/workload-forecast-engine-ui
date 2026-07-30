import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "./CategoryDemandBarChart.css";

const RISK_COLOR = (pct) => {
  if (pct === null || pct === undefined) return "#64748b";
  if (pct >= 40) return "#ef4444";
  if (pct >= 20) return "#f59e0b";
  return "#10b981";
};

/**
 * @param {object} props
 * @param {Array<{label, value, costInr, pctOfTotal, stockoutRiskPct, stockoutRiskScore, reasoning}>} props.bars
 */
export default function CategoryDemandBarChart({ bars = [] }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || bars.length === 0) return;

    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current.getContext("2d"), {
      type: "bar",
      data: {
        labels: bars.map((b) => b.label),
        datasets: [
          {
            label: "30-day forecast qty",
            data: bars.map((b) => b.value),
            backgroundColor: bars.map((b) => RISK_COLOR(b.stockoutRiskScore * 100)),
            borderRadius: 6,
            maxBarThickness: 56,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const b = bars[ctx.dataIndex];
                const lines = [`Qty: ${b.value.toLocaleString()} (${b.pctOfTotal}% of total)`];
                if (b.costInr != null) lines.push(`Est. cost: ₹${Math.round(b.costInr).toLocaleString("en-IN")}`);
                lines.push(`Stockout risk: ${b.stockoutRiskPct}`);
                return lines;
              },
            },
          },
        },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: "Units (30d)" } },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [bars]);

  if (bars.length === 0) {
    return <div className="categoryBarCard categoryBarEmpty">No category demand data available.</div>;
  }

  return (
    <div className="categoryBarCard">
      <div className="categoryBarHeader">
        <h3>30-Day Demand by Category</h3>
        <div className="categoryBarLegend">
          <span><i className="dot low" />Low risk</span>
          <span><i className="dot medium" />Medium</span>
          <span><i className="dot high" />High</span>
        </div>
      </div>
      <div className="categoryBarCanvasWrap">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

import "./KpiCard.css";

export default function KpiCard({
  title,
  value,
  subText,
  positive = true,
  alert = false,
}) {
  return (
    <div className={`kpiCard ${alert ? "alert" : ""}`}>
      <div className="kpiTitle">
        {title}
      </div>

      <div className="kpiValue">
        {value}
      </div>

      <div
        className={`kpiSub ${
          positive ? "positive" : "negative"
        }`}
      >
        {subText}
      </div>
    </div>
  );
}
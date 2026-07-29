import "./Card.css";

export default function Card({
  title,
  tag,
  children,
  height = "420px",
  className = "",
  style = {},
}) {
  return (
    <div
      className={`dashboardCard ${className}`.trim()}
      style={{ minHeight: height, ...style }}
    >
      <div className="cardTop">
        <h3>{title}</h3>

        {tag && <span>{tag}</span>}
      </div>

      <div className="cardContent">{children}</div>
    </div>
  );
}

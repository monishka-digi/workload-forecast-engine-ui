import "./Card.css";

export default function Card({
  title,

  tag,

  children,

  height = "420px",
}) {
  return (
    <div className="dashboardCard" style={{ height }}>
      <div className="cardTop">
        <h3>{title}</h3>

        {tag && <span>{tag}</span>}
      </div>

      <div className="cardContent">{children}</div>
    </div>
  );
}

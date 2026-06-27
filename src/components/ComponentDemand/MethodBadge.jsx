import "./MethodBadge.css";

export default function MethodBadge({ method }) {
  const colors = {
    ml_forecast: "#00d4aa",
    ratio_fallback: "#f5b400",
    historical: "#4f8cff",
  };

  return (
    <span
      className="methodBadge"
      style={{
        background: `${colors[method] || "#666"}22`,
        color: colors[method] || "#fff",
      }}
    >
      {method}
    </span>
  );
}
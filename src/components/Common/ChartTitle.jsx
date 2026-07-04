import InfoTooltip from "./Tooltip/InfoTooltip";

export default function ChartTitle({
  title,
  tooltip,
  position = "bottom",
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "20px",
        fontWeight: 700,
        color: "var(--text)",
        lineHeight: 1.2,
      }}
    >
      <span>{title}</span>

      {tooltip && (
        <InfoTooltip
          position={position}
          content={tooltip}
        >
          <span className="infoIcon">i</span>
        </InfoTooltip>
      )}
    </div>
  );
}
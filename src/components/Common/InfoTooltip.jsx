import "./InfoTooltip.css";

export default function InfoTooltip({
  content,
  position = "top",
  children,
}) {
  return (
    <div className="tooltipWrapper">
      {children}

      <div className={`tooltipBox ${position}`}>
        {content}
      </div>
    </div>
  );
}
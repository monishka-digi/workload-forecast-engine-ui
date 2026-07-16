import "./DashboardLayout.css";

export default function DashboardLayout({
  loading,
  error,

  kpis,

  topLeft,
  topRight,

  middleLeft,
  middleRight,

  bottomLeft,
  bottomRight,

  table,
}) {
  const renderRow = (left, right) => {
    const items = [left, right].filter(Boolean);

    if (!items.length) {
      return null;
    }

    return (
      <div
        className={`dashboardGrid ${
          items.length === 1 ? "dashboardGrid--single" : ""
        }`}
      >
        {items.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>
    );
  };

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error...</div>;

  return (
    <>
      {kpis}

      {/* First Row */}
      {renderRow(topLeft, topRight)}

      {/* Second Row */}
      {renderRow(middleLeft, middleRight)}

      {/* Third Row */}
      {renderRow(bottomLeft, bottomRight)}

      {table}
    </>
  );
}

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
  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error...</div>;

  return (
    <>
      {kpis}

      {/* First Row */}
      {(topLeft || topRight) && (
        <div className="dashboardGrid">
          <div>{topLeft}</div>
          <div>{topRight}</div>
        </div>
      )}

      {/* Second Row */}
      {(middleLeft || middleRight) && (
        <div className="dashboardGrid">
          <div>{middleLeft}</div>
          <div>{middleRight}</div>
        </div>
      )}

      {/* Third Row */}
      {(bottomLeft || bottomRight) && (
        <div className="dashboardGrid">
          <div>{bottomLeft}</div>
          <div>{bottomRight}</div>
        </div>
      )}

      {table}
    </>
  );
}
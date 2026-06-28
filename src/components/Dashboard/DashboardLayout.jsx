export default function DashboardLayout({
  loading,
  error,
  kpis,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  table,
}) {
  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error...</div>;

  return (
    <>
      {kpis}

      <div className="dashboardGrid">
        <div>{topLeft}</div>
        <div>{topRight}</div>
      </div>

      <div className="dashboardGrid">
        <div>{bottomLeft}</div>
        <div>{bottomRight}</div>
      </div>

      {table}
    </>
  );
}
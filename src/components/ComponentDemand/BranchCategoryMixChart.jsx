import Card from "../Common/Card";

export default function BranchCategoryMixChart({
  data,
}) {
  if (!data?.length) {
    return (
      <Card
        title="Branch × Category Mix"
        tag="stacked"
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#777",
          }}
        >
          Coming Soon
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Branch × Category Mix"
      tag="stacked"
    >
      {/* Chart.js stacked bar will come here */}
    </Card>
  );
}
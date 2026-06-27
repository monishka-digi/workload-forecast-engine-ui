import "./CategoryDemandChart.css";
import Card from "../Common/Card";

export default function CategoryDemandChart({ data }) {
  if (!data) return null;

  const values = data.datasets[0].data;
  const max = Math.max(...values);

  return (
    <Card
      title="Demand by component category"
      tag="predicted_qty_consumed"
      height="420px"
    >
      <div className="categoryChart">
        {data.labels.map((label, index) => {
          const value = values[index];

          return (
            <div
              className="categoryRow"
              key={label}
            >
              <div className="categoryName">
                {label}
              </div>

              <div className="categoryProgress">
                <div
                  className="categoryFill"
                  style={{
                    width: `${(value / max) * 100}%`,
                  }}
                />
              </div>

              <div className="categoryValue">
                {value.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
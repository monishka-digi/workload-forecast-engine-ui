import "./BranchLoadGauge.css";

export default function BranchLoadGauge({ data = [] }) {
  return (
    <div className="branchGaugeCard">
      <div className="branchGaugeHeader">
        <h3>Branch load gauge</h3>

        <span>predicted_load_pct vs 100% rated capacity</span>
      </div>

      <div className="branchGaugeBody">
        {data.map((branch) => {
          const width = Math.min(branch.load, 110);

          return (
            <div
              key={branch.id}
              className="gaugeRow"
            >
              <div className="gaugeInfo">
                <h4>{branch.branch}</h4>

                <p>{branch.geography}</p>
              </div>

              <div className="gaugeBarContainer">
                <div className="gaugeTrack">
                  <div
                    className={`gaugeFill ${
                      branch.load > 100 ? "danger" : "normal"
                    }`}
                    style={{
                      width: `${width}%`,
                    }}
                  />

                  {/* 100% marker */}
                  <div className="capacityMarker" />
                </div>

                <span
                  className={
                    branch.load > 100
                      ? "dangerText"
                      : "normalText"
                  }
                >
                  {branch.load}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
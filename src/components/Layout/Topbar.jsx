import "./topbar.css";

export default function Topbar() {
  return (
    <div className="topbar">
      <div>
        <h2>Job Volume Prediction</h2>

        <p>All branches · South & West region workshops</p>
      </div>

      <div className="right">
        <select>
          <option>Next 60 Days</option>
        </select>

        <select>
          <option>All Branches</option>
        </select>

        <div className="live">● Live</div>
      </div>
    </div>
  );
}

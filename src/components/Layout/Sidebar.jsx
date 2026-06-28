import { NavLink } from "react-router-dom";
import "./sidebar.css";

const menu = [
  { name: "Job Volume", path: "/job-volume", enabled: true },
  { name: "Component Demand", path: "/component-demand", enabled: true },
  { name: "Branch Load", path: "/branch-load", enabled: true },
  { name: "Bay Utilization", path: "/bay-utilization", enabled: true },
  { name: "Technician Demand", enabled: false },
];

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="brand">
        <div className="logo">GM</div>

        <div>
          <h3>GMMCO Limited</h3>
          <p>WORKLOAD FORECAST</p>
        </div>
      </div>

      <div className="menu">
        <p className="heading">FORECAST MODELS</p>

        {menu.map((item) =>
          item.enabled ? (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `menuItem ${isActive ? "active" : ""}`
              }
            >
              <div className="dot" />
              {item.name}
            </NavLink>
          ) : (
            <div key={item.name} className="menuItem disabled">
              <div className="dot" />
              {item.name}
            </div>
          ),
        )}
      </div>

      <div className="footer">
        v1.0
        <br />
        Forecast Run
      </div>
    </div>
  );
}

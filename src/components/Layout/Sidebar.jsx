import { NavLink } from "react-router-dom";
import "./sidebar.css";

const menu = [
  {
    name: "Job Volume",
    path: "/job-volume",
  },
  {
    name: "Component Demand",
    path: "/component-demand",
  },
  {
    name: "Branch Load",
    path: "/branch-load",
  },
  {
    name: "Bay Utilization",
    path: "/bay-utilization",
  },
  {
    name: "Technician Demand",
    path: "/technician-demand",
  },
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

        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end
            className={({ isActive }) => `menuItem ${isActive ? "active" : ""}`}
          >
            <div className="dot" />
            {item.name}
          </NavLink>
        ))}
      </div>

      <div className="footer">
        v1.0
        <br />
        Forecast Run
      </div>
    </div>
  );
}

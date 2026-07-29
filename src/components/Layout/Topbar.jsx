import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./topbar.css";
import { useTheme } from "../../context/ThemeContext";
import { DEFAULT_BRANCH_OPTIONS } from "../../context/DashboardFilterContext";
import useDashboardFilters from "../../context/useDashboardFilters";

export default function Topbar() {
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();

  const pages = {
    "/job-volume": {
      title: "Job Volume Prediction",
      subtitle: "All branches · South & West region workshops",
    },
    "/component-demand": {
      title: "Component Category Demand",
      subtitle: "Parts consumption forecast driven by job-volume model",
    },
    "/branch-load": {
      title: "Branch-wise Load Forecast",
      subtitle: "Workload as % of rated branch capacity",
    },
    "/bay-utilization": {
      title: "Bay Utilization Forecast",
      subtitle: "Bay occupancy by branch and bay type",
    },
    "/technician-demand": {
      title: "Technician Demand Forecast",
      subtitle: "Required headcount & skill-mix per branch",
    },
  };

  const page = pages[pathname] || {
    title: "Forecast Dashboard",
    subtitle: "",
  };

  const {
    forecastDays,
    setForecastDays,
    selectedBranch,
    setSelectedBranch,
    branchOptions,
  } = useDashboardFilters();

  const branchSelectOptions = branchOptions?.length
    ? branchOptions
    : DEFAULT_BRANCH_OPTIONS;

  useEffect(() => {
    const options = branchOptions?.length ? branchOptions : DEFAULT_BRANCH_OPTIONS;

    if (!options.some((option) => option.value === selectedBranch)) {
      setSelectedBranch(options[0]?.value || "ALL");
    }
  }, [branchOptions, selectedBranch, setSelectedBranch]);

  return (
    <div className="topbar">
      <div>
        <h2>{page.title}</h2>

        <p>{page.subtitle}</p>
      </div>

      <div className="right">
        <select
          className="topbarSelect"
          value={forecastDays}
          onChange={(e) => setForecastDays(Number(e.target.value))}
          aria-label="Select forecast horizon"
        >
          <option value={30}>Next 30 Days</option>
          <option value={60}>Next 60 Days</option>
          <option value={90}>Next 90 Days</option>
        </select>

        <select
          className="topbarSelect"
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          aria-label="Select branch"
        >
          {branchSelectOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="live">● Live</div>
        <button onClick={toggleTheme}>{theme === "dark" ? "☀️" : "🌙"}</button>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import JobVolume from "./JobVolume";
import ComponentDemand from "./ComponentDemand";

export default function ForecastDashboard() {
  const [activeTab, setActiveTab] = useState("jobVolume");

  const renderContent = () => (activeTab === "jobVolume" ? <JobVolume /> : <ComponentDemand />);

  return (
    <div className="forecast-dashboard">
      <style>{`
        .forecast-dashboard {padding: 16px; font-family: 'Inter', sans-serif;}
        .tab-header {display: flex; position: relative; border-bottom: 2px solid #e0e0e0; margin-bottom: 16px;}
        .tab-button {flex: 1; background: transparent; border: none; padding: 12px 0; cursor: pointer; font-size: 1rem; font-weight: 500; color: #555; transition: color 0.2s;}
        .tab-button:hover {color: #000;}
        .tab-button.active {color: #000; font-weight: 600;}
        .tab-indicator {position: absolute; bottom: -2px; width: 50%; height: 2px; background-color: #f5b400; transition: left 0.3s ease;}
        .tab-content {padding-top: 8px;}
      `}</style>
      <div className="tab-header" role="tablist">
        <button className={`tab-button ${activeTab === "jobVolume" ? "active" : ""}`} onClick={() => setActiveTab("jobVolume")} role="tab" aria-selected={activeTab === "jobVolume"}>Job Volume</button>
        <button className={`tab-button ${activeTab === "componentDemand" ? "active" : ""}`} onClick={() => setActiveTab("componentDemand")} role="tab" aria-selected={activeTab === "componentDemand"}>Component Demand</button>
        <div className="tab-indicator" style={{ left: activeTab === "jobVolume" ? "0%" : "50%" }} />
      </div>
      <div className="tab-content" role="tabpanel">{renderContent()}</div>
    </div>
  );
}

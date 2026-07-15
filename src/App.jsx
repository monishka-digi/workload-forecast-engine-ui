import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout/Layout";

import JobVolume from "./features/JobVolume/JobVolume";
import ComponentDemand from "./features/ComponentDemand/ComponentDemand";
import BranchLoad from "./features/BranchLoad/BranchLoad";
import BayUtilization from "./features/BayUtilization/BayUtilization";
import TechnicianDemand from "./features/TechnicianDemand/TechnicianDemand";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/job-volume" replace />} />
        <Route path="/job-volume" element={<JobVolume />} />
        <Route path="/component-demand" element={<ComponentDemand />} />
        <Route path="/branch-load" element={<BranchLoad />} />
        <Route path="/bay-utilization" element={<BayUtilization />} />
        <Route path="/technician-demand" element={<TechnicianDemand />} />
      </Route>
    </Routes>
  );
}

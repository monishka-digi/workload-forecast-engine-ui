import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout/Layout";

import JobVolume from "./pages/JobVolume";
import ComponentDemand from "./pages/ComponentDemand";
import BranchLoad from "./pages/BranchLoad";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/job-volume" replace />} />

        <Route path="/job-volume" element={<JobVolume />} />

        <Route path="/component-demand" element={<ComponentDemand />} />

        <Route path="/branch-load" element={<BranchLoad />} />
      </Route>
    </Routes>
  );
}
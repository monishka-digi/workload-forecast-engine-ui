import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import JobVolume from "./pages/JobVolume";
import ComponentDemand from "./pages/ComponentDemand";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<JobVolume />} />
        <Route path="job-volume" element={<JobVolume />} />
        <Route path="component-demand" element={<ComponentDemand />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
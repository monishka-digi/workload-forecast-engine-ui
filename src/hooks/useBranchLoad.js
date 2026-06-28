import { useEffect, useState } from "react";
import { getBranchLoadDashboard } from "../api/branchLoadApi";
import { mapBranchLoadData } from "../utils/branchLoadMapper";

export default function useBranchLoad() {
  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);

      const response = await getBranchLoadDashboard();

      const mapped = mapBranchLoadData(response);

      setDashboard(mapped);
    } catch (err) {
      console.error(err);

      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    dashboard,
    refresh: loadDashboard,
  };
}
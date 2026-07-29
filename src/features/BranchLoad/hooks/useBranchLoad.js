import { useEffect, useState } from "react";
import { getBranchLoadDashboard } from "../api/branchLoadApi";
import { mapBranchLoadData } from "../utils/branchLoadMapper";

export default function useBranchLoad(
  branchId = "ALL",
  forecastDays = 30,
) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, [branchId, forecastDays]);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError(null);

      const response = await getBranchLoadDashboard(
        branchId,
        forecastDays,
      );

      const mapped = mapBranchLoadData(response, forecastDays, branchId);

      setDashboard(mapped);
    } catch (err) {
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

import { useEffect, useState } from "react";
import { getComponentDemandDashboard } from "../api/componentDemandApi";
import { mapComponentDemandData } from "../utils/componentDemandMapper";

export default function useComponentDemand(
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

      const response = await getComponentDemandDashboard(
        branchId,
        forecastDays,
      );

      setDashboard(mapComponentDemandData(response, forecastDays, branchId));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return {
    dashboard,
    loading,
    error,
    refresh: loadDashboard,
  };
}

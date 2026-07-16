import { useEffect, useState } from "react";
import { getTechnicianDemandDashboard } from "../api/technicianDemandApi";
import { mapTechnicianDemandData } from "../utils/technicianDemandMapper";

export default function useTechnicianDemand(
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

      const response = await getTechnicianDemandDashboard(
        branchId,
        forecastDays,
      );

      setDashboard(mapTechnicianDemandData(response, forecastDays, branchId));
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

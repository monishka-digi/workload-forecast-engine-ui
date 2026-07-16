import { useEffect, useState } from "react";

import { getBayUtilizationDashboard } from "../api/bayUtilizationApi";
import { mapBayUtilizationData } from "../utils/bayUtilizationMapper.js";

export default function useBayUtilization(
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

      const response = await getBayUtilizationDashboard(
        branchId,
        forecastDays,
      );

      const mapped = mapBayUtilizationData(response, forecastDays);

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

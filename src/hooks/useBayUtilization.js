import { useEffect, useState } from "react";

import { getBayUtilizationDashboard } from "../api/bayUtilizationApi";
import { mapBayUtilizationData } from "../utils/bayUtilizationMapper.js";

export default function useBayUtilization() {
  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);

      const response = await getBayUtilizationDashboard();

      const mapped = mapBayUtilizationData(response);

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

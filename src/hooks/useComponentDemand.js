import { useEffect, useState } from "react";
import { getComponentDemandDashboard } from "../api/componentDemandApi";
import { mapComponentDemandData } from "../utils/componentDemandMapper";

export default function useComponentDemand() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);

      const response = await getComponentDemandDashboard();

      const mapped = mapComponentDemandData(response);

      setDashboard(mapped);
    } catch (err) {
      console.error(err);
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
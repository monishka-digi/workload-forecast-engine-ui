import { useEffect, useState } from "react";
import { getTechnicianDemandDashboard } from "../api/technicianDemandApi";
import { mapTechnicianDemandData } from "../utils/technicianDemandMapper";

export default function useTechnicianDemand() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response = await getTechnicianDemandDashboard();

      setDashboard(mapTechnicianDemandData(response));
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    dashboard,
    loading,
    error,
    refresh: loadDashboard,
  };
}
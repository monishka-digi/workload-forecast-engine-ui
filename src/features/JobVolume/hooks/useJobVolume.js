import { useEffect, useState } from "react";
import { getJobVolumeDashboard } from "../api/jobVolumeApi";
import { mapJobVolumeData } from "../utils/jobVolumeMapper";

export default function useJobVolume(
  branchId = "ALL",
  forecastDays = 30
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

      const response = await getJobVolumeDashboard(
        branchId,
        forecastDays
      );

      const mapped = mapJobVolumeData(response, forecastDays, branchId);

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
    refresh: () =>
      loadDashboard(branchId, forecastDays),
  };
}

import { useEffect, useState } from "react";
import { getJobVolumeDashboard } from "../api/jobVolumeApi";
import { mapJobVolumeData } from "../utils/jobVolumeMapper";

export default function useJobVolume() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);

      const response = await getJobVolumeDashboard();

      const mapped = mapJobVolumeData(response);

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

import mockData from "../data/jobVolumeResponse.json";

const BASE_URL = "http://localhost:9090/api";
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const getJobVolumeDashboard = async (
  branchId = "ALL",
  forecastDays = 30
) => {
  // Mock mode fallback
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockData.result), 300);
    });
  }

  // Live API call
  const params = new URLSearchParams({
    branch_id: branchId,
    forecast_horizon_days: forecastDays,
  }).toString();

  const url = `${BASE_URL}/v1/forecasts/job-volume?${params}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // The API wraps the payload in { success, message, result }
  if (!data.success) {
    throw new Error(data.message || "Job Volume API returned an error");
  }

  return data.result;
};
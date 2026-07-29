import mockData from "../data/branchLoadResponse.json";

const BASE_URL = "http://localhost:9090/api";
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const getBranchLoadDashboard = async (
  branchId = "ALL",
  forecastDays = 30,
) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockData.result), 300);
    });
  }

  const params = new URLSearchParams({
    branch_id: branchId,
    forecast_horizon_days: forecastDays,
  }).toString();

  const url = `${BASE_URL}/v1/forecasts/branch-load?${params}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Branch Load API returned an error");
  }

  return data.result;
};

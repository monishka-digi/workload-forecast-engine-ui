const BASE_URL = "http://localhost:9090/api";

export const getTechnicianDemandDashboard = async (
  branchId = "ALL",
  forecastDays = 30,
) => {
  const params = new URLSearchParams({
    branch_id: branchId,
    skill_category: "ALL",
    gap_status: "ALL",
    forecast_horizon_days: forecastDays,
    geography_zone: "ALL",
    page: "1",
    page_size: "20",
  }).toString();

  const url = `${BASE_URL}/v1/technician-demand/technician-demand?${params}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Technician Demand API returned an error");
  }

  return data.result;
};

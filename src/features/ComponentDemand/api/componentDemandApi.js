const BASE_URL = "http://localhost:9090/api";

export const getComponentDemandDashboard = async (
  branchId = "ALL",
  forecastDays = 30,
) => {
  const params = new URLSearchParams({
    component_category: "ALL",
    branch_id: branchId,
    machine_type: "ALL",
    forecast_horizon_days: forecastDays,
    stockout_risk: "ALL",
    page: "1",
    page_size: "20",
  }).toString();

  const url = `${BASE_URL}/v1/component-forecast/component-category-demand?${params}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Component Demand API returned an error");
  }

  return data.result;
};

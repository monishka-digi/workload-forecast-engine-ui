import { apiRequest } from "../../../api/client";
import data from "../data/componentDemandResponse.json";

export const getComponentDemandDashboard = async () => {
  return apiRequest("/component-demand", { mockData: data.result, delay: 300 });
};
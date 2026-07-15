import { apiRequest } from "../../../api/client";
import technicianDemandData from "../data/technicianDemand.json";

export const getTechnicianDemandDashboard = async () => {
  return apiRequest("/technician-demand", { mockData: technicianDemandData.result, delay: 300 });
};
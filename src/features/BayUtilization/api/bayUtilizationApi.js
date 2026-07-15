import { apiRequest } from "../../../api/client";
import bayUtilizationData from "../data/bayUtilization.json";

export const getBayUtilizationDashboard = async () => {
  return apiRequest("/bay-utilization", { mockData: bayUtilizationData.result, delay: 400 });
};
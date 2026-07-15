import { apiRequest } from "../../../api/client";
import branchLoadData from "../data/branchLoadResponse.json";

export const getBranchLoadDashboard = async () => {
  return apiRequest("/branch-load", { mockData: branchLoadData.result, delay: 500 });
};
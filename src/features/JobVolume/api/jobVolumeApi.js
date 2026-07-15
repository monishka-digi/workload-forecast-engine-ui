import { apiRequest } from "../../../api/client";
import mockData from "../data/jobVolumeResponse.json";

export const getJobVolumeDashboard = async () => {
  return apiRequest("/job-volume", { mockData: mockData.result, delay: 300 });
};
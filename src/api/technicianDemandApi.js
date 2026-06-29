import technicianDemandData from "../data/technicianDemand.json";

export const getTechnicianDemandDashboard = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(technicianDemandData.result);
    }, 300);
  });
};
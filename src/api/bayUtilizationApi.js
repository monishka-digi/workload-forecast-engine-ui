import bayUtilizationData from "../data/bayUtilization.json";

export const getBayUtilizationDashboard = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(bayUtilizationData.result);
    }, 400);
  });
};
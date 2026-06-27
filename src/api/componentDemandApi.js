import data from "../data/componentDemandResponse.json";

export const getComponentDemandDashboard = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data.result);
    }, 300);
  });
};
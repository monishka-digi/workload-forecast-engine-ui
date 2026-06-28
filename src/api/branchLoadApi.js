import branchLoadData from "../data/branchLoadResponse";

export const getBranchLoadDashboard = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(branchLoadData.result);
    }, 500);
  });
};

// import axios from "../config/axios";

// export const getBranchLoadDashboard = async () => {
//   const { data } = await axios.get("/branch-load");
//   return data.result;
// };
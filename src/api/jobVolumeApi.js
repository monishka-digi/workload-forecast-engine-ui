import mockData from "../data/jobVolumeResponse.json";

export const getJobVolumeDashboard = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData.result);
    }, 300);
  });
};


// import axios from "axios";

// export const getJobVolumeDashboard = async () => {
//   const { data } = await axios.get("/job-volume");

//   return data.result;
// };
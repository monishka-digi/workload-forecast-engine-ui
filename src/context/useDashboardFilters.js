import { useContext } from "react";
import DashboardFilterContext from "./DashboardFilterContext";

export default function useDashboardFilters() {
  return useContext(DashboardFilterContext);
}
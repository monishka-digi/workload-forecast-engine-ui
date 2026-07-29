import { createContext, useCallback, useMemo, useState } from "react";

const DashboardFilterContext = createContext();

const DEFAULT_BRANCH_LIST = [
  { branch_id: "B1001", branch_name: "Nagpur Central Branch" },
  { branch_id: "B1002", branch_name: "Nagpur Industrial Branch" },
  { branch_id: "B1003", branch_name: "Nagpur North Branch" },
  { branch_id: "B1004", branch_name: "Nagpur South Branch" },
  { branch_id: "B1005", branch_name: "Nagpur East Branch" },
  { branch_id: "B1006", branch_name: "Chennai West Branch" },
  { branch_id: "B2001", branch_name: "Chennai Central Branch" },
  { branch_id: "B2002", branch_name: "Chennai Industrial Branch" },
  { branch_id: "B2003", branch_name: "Chennai South Branch" },
  { branch_id: "B2004", branch_name: "Chennai South Branch" },
];

const DEFAULT_BRANCH_LOOKUP = new Map(
  DEFAULT_BRANCH_LIST.map(({ branch_id, branch_name }) => [branch_id, branch_name]),
);

export const DEFAULT_BRANCH_OPTIONS = [
  { value: "ALL", label: "All Branches" },
  ...DEFAULT_BRANCH_LIST.map(({ branch_id, branch_name }) => ({
    value: branch_id,
    label: branch_name,
  })),
];

const normalizeBranchOption = (option) => {
  if (!option) return null;

  if (typeof option === "string") {
    return option === "ALL"
      ? { value: "ALL", label: "All Branches" }
      : {
          value: option,
          label: DEFAULT_BRANCH_LOOKUP.get(option) ?? option,
        };
  }

  const value = option.value ?? option.branch_id ?? option.branchId ?? "ALL";
  const label =
    option.branch_name ??
    option.branchName ??
    option.label ??
    DEFAULT_BRANCH_LOOKUP.get(value) ??
    value;

  return {
    value,
    label,
  };
};

const normalizeBranchOptions = (options = []) => {
  const normalized = [
    { value: "ALL", label: "All Branches" },
    ...options
      .map(normalizeBranchOption)
      .filter(Boolean)
      .filter((option) => option.value !== "ALL"),
  ];

  return Array.from(
    new Map(normalized.map((option) => [option.value, option])).values(),
  );
};

const areBranchOptionsEqual = (left = [], right = []) => {
  if (left.length !== right.length) return false;

  return left.every(
    (option, index) =>
      option.value === right[index]?.value && option.label === right[index]?.label,
  );
};

export default DashboardFilterContext;
export function DashboardFilterProvider({ children }) {
  const [forecastDays, setForecastDays] = useState(30);
  const [selectedBranch, setSelectedBranch] = useState("ALL");

  const [branchOptionsState, setBranchOptionsState] = useState(
    DEFAULT_BRANCH_OPTIONS,
  );

  const branchOptions = useMemo(
    () => normalizeBranchOptions(branchOptionsState),
    [branchOptionsState],
  );

  const setBranchOptions = useCallback((options) => {
    const nextOptions = normalizeBranchOptions(options);

    setBranchOptionsState((currentOptions) =>
      areBranchOptionsEqual(currentOptions, nextOptions)
        ? currentOptions
        : nextOptions,
    );
  }, []);

  return (
    <DashboardFilterContext.Provider
      value={{
        forecastDays,
        setForecastDays,
        selectedBranch,
        setSelectedBranch,
        branchOptions,
        setBranchOptions,
      }}
    >
      {children}
    </DashboardFilterContext.Provider>
  );
}


export const isAllBranches = (branchId) =>
  branchId === undefined || branchId === null || branchId === "ALL";

export const getRowBranchId = (row) =>
  row?.branch_id ?? row?.branchId ?? row?.branch ?? row?.branch_name ?? null;

export const formatBranchLabel = (value) => {
  const label = String(value ?? "").replace(/\bBranch\b/gi, "").replace(/\s+/g, " ").trim();

  return label || String(value ?? "").trim();
};

export const matchesBranch = (row, branchId) => {
  if (isAllBranches(branchId)) return true;

  const rowBranchId = getRowBranchId(row);

  return rowBranchId === branchId;
};

export const filterRowsByBranch = (rows = [], branchId = "ALL") =>
  isAllBranches(branchId) ? rows : rows.filter((row) => matchesBranch(row, branchId));

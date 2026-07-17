const BRANCH_COLOR_PALETTE = [
  "#f5b400",
  "#36d7c2",
  "#8bcf67",
  "#34d6b8",
  "#a3e635",
  "#f59e0b",
  "#22c55e",
  "#14b8a6",
  "#84cc16",
  "#06b6d4",
  "#0ea5e9",
  "#ef5a5a",
  "#8b5cf6",
  "#64748b",
  "#94a3b8",
  "#ca8a04",
  "#16a34a",
  "#db2777",
  "#4b8df8",
  "#f97316",
  "#0f766e",
  "#7c3aed",
  "#be185d",
  "#1d4ed8",
  "#dc2626",
];

const toBranchKey = (option) =>
  String(option?.value ?? option?.branch_id ?? option?.branchId ?? option ?? "");

const hashBranchKey = (value = "") => {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
};

export const buildBranchColorMap = (branchOptions = [], fallbackIds = []) => {
  const orderedKeys = [
    ...branchOptions.map(toBranchKey),
    ...fallbackIds.map((value) => String(value ?? "")),
  ].filter(Boolean);

  const uniqueKeys = [...new Set(orderedKeys)];

  return new Map(
    uniqueKeys.map((key, index) => [
      key,
      BRANCH_COLOR_PALETTE[index % BRANCH_COLOR_PALETTE.length],
    ]),
  );
};

export const getBranchColor = (branchKey, branchColorMap) => {
  const key = String(branchKey ?? "");

  if (branchColorMap?.has(key)) {
    return branchColorMap.get(key);
  }

  return BRANCH_COLOR_PALETTE[hashBranchKey(key) % BRANCH_COLOR_PALETTE.length];
};

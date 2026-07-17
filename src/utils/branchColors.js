const BRANCH_COLOR_PALETTE = [
  "#2563EB",
  "#F97316",
  "#10B981",
  "#8B5CF6",
  "#E11D48",
  "#0EA5E9",
  "#F59E0B",
  "#14B8A6",
  "#22C55E",
  "#D946EF",
  "#DC2626",
  "#7C3AED",
  "#059669",
  "#EA580C",
  "#0891B2",
  "#84CC16",
  "#BE185D",
  "#4F46E5",
  "#0F766E",
  "#CA8A04",
  "#9333EA",
  "#16A34A",
  "#DB2777",
  "#1D4ED8",
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


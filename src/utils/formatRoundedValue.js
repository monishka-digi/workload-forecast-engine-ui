const toNumber = (value) => Number(value ?? 0);

export const formatRoundedValue = (value, decimals = 0) =>
  toNumber(value).toFixed(Number(decimals) || 0);

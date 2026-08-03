const toDate = (value) => {
  if (!value) return null;

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const getForecastStartIndex = ({
  periodDates = [],
  currentDateMarker = null,
  forecastFlags = [],
} = {}) => {
  if (!Array.isArray(periodDates) || periodDates.length === 0) {
    return -1;
  }

  if (currentDateMarker) {
    const exactIndex = periodDates.findIndex((periodDate) => periodDate === currentDateMarker);
    if (exactIndex >= 0) return exactIndex;

    const markerDate = toDate(currentDateMarker);
    if (markerDate) {
      const nextIndex = periodDates.findIndex((periodDate) => {
        const periodDateValue = toDate(periodDate);
        return periodDateValue && periodDateValue.getTime() >= markerDate.getTime();
      });

      if (nextIndex >= 0) return nextIndex;
    }
  }

  if (Array.isArray(forecastFlags) && forecastFlags.length > 0) {
    const flaggedIndex = forecastFlags.findIndex(Boolean);
    if (flaggedIndex >= 0) return flaggedIndex;
  }

  return -1;
};

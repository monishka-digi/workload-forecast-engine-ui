const toDate = (value) => {
  if (value == null) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) return null;

    const isoDateMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (isoDateMatch) {
      const [, year, month, day] = isoDateMatch;
      const date = new Date(Number(year), Number(month) - 1, Number(day));
      return Number.isNaN(date.getTime()) ? null : date;
    }

    const date = new Date(trimmed);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  return null;
};

const toDayStart = (date) => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

const isChartObject = (value) =>
  value && typeof value === "object" && Array.isArray(value.datasets) && Array.isArray(value.labels);

const isNumericSeries = (values = []) =>
  values.length > 0 &&
  values.every((value) => value !== null && value !== "" && Number.isFinite(Number(value)));

const sortIndicesByDate = (entries = []) =>
  [...entries].sort((left, right) => {
    const delta = left.date.getTime() - right.date.getTime();
    return delta !== 0 ? delta : left.index - right.index;
  });

const filterIndicesByDays = (entries = [], selectedDays) => {
  if (!entries.length) return [];

  const sortedEntries = sortIndicesByDate(entries);
  const earliestDate = sortedEntries[0].date;
  const horizonDays = Number(selectedDays);

  if (!Number.isFinite(horizonDays) || horizonDays <= 0) {
    return sortedEntries.map((entry) => entry.index);
  }

  const startDate = toDayStart(earliestDate);
  const endDate = toDayStart(earliestDate);
  endDate.setDate(endDate.getDate() + horizonDays);

  return sortedEntries
    .filter((entry) => entry.date >= startDate && entry.date <= endDate)
    .map((entry) => entry.index);
};

export const filterDataByPeriod = (data, selectedDays, dateKey = "period_date") => {
  if (!data) return data;

  const horizonDays = Number(selectedDays);

  if (Array.isArray(data)) {
    if (!data.length) return data;

    const entries = data
      .map((item, index) => {
        const rawValue = item?.[dateKey];
        const parsedDate = toDate(rawValue);

        return parsedDate
          ? { item, index, date: parsedDate }
          : null;
      })
      .filter(Boolean);

    if (!entries.length) return [...data];

    if (isNumericSeries(data.map((item) => item?.[dateKey]))) {
      return [...data]
        .filter((item) => Number(item?.[dateKey]) === horizonDays)
        .sort((left, right) => Number(left?.[dateKey]) - Number(right?.[dateKey]));
    }

    const filteredIndices = filterIndicesByDays(entries, horizonDays);
    const lookup = new Set(filteredIndices);

    return [...data]
      .filter((_, index) => lookup.has(index))
      .sort((left, right) => {
        const leftDate = toDate(left?.[dateKey]);
        const rightDate = toDate(right?.[dateKey]);

        if (!leftDate || !rightDate) return 0;
        return leftDate.getTime() - rightDate.getTime();
      });
  }

  if (!isChartObject(data)) {
    return data;
  }

  const periodValues = Array.isArray(data[dateKey]) ? data[dateKey] : data.labels;

  if (!periodValues.length) return data;

  if (isNumericSeries(periodValues)) {
    const filteredIndices = periodValues
      .map((value, index) => ({ value: Number(value), index }))
      .filter((entry) => entry.value === horizonDays)
      .sort((left, right) => left.value - right.value || left.index - right.index)
      .map((entry) => entry.index);

    if (!filteredIndices.length) return data;

    return {
      ...data,
      labels: filteredIndices.map((index) => data.labels[index]),
      [dateKey]: filteredIndices.map((index) => periodValues[index]),
      datasets: data.datasets.map((dataset) => ({
        ...dataset,
        data: filteredIndices.map((index) => dataset.data[index]),
      })),
    };
  }

  const entries = periodValues
    .map((value, index) => {
      const parsedDate = toDate(value);
      return parsedDate ? { index, date: parsedDate } : null;
    })
    .filter(Boolean);

  if (!entries.length) return data;

  const filteredIndices = filterIndicesByDays(entries, horizonDays);

  if (!filteredIndices.length) return data;

  return {
    ...data,
    labels: filteredIndices.map((index) => data.labels[index]),
    [dateKey]: filteredIndices.map((index) => periodValues[index]),
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      data: filteredIndices.map((index) => dataset.data[index]),
    })),
  };
};

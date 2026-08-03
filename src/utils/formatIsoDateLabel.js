const parseIsoDateAsLocal = (value) => {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const text = String(value).trim();
  if (!text) return null;

  const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatIsoDateLabel = (
  value,
  locale = "en-IN",
  options = {
    day: "2-digit",
    month: "short",
  },
) => {
  const date = parseIsoDateAsLocal(value);
  if (!date) return "";

  return new Intl.DateTimeFormat(locale, options).format(date);
};

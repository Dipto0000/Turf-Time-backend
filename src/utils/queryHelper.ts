export const getStringQuery = (value: unknown): string | undefined => {
  if (typeof value === 'string') {
    return value;
  }
  if (Array.isArray(value) && value.length > 0) {
    return String(value[0]);
  }
  return undefined;
};

export const getNumQuery = (value: unknown): number | undefined => {
  const str = getStringQuery(value);
  if (str === undefined) return undefined;
  const num = parseInt(str, 10);
  return isNaN(num) ? undefined : num;
};

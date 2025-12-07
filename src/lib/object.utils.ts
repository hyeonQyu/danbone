export const getObjectAtPath = <T>(obj: T, path: string, splitter = '.') => {
  if (!path || path === splitter) return obj;

  const keys = path.split(splitter);
  let value: unknown = obj;

  for (const key of keys) {
    value = (value as Record<string, unknown>)[key];
    if (value === undefined) {
      return undefined;
    }
  }

  return value;
};

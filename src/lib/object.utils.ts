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

export const convertIterableToObject = (iterable: Iterable<readonly [string, string]> | null | undefined): Record<string, string> => {
  if (!iterable) return {};
  return Object.fromEntries(Array.from(iterable));
};

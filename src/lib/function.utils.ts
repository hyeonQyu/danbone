export const tap = <T>(value: T, interceptor: (value: T) => void): T => {
  interceptor(value);
  return value;
};

export const overEvery =
  <T extends unknown[]>(...predicates: ((...args: T) => boolean)[]) =>
  (...args: T) =>
    predicates.every((predicate) => predicate(...args));

export const overSome =
  <T extends unknown[]>(...predicates: ((...args: T) => boolean)[]) =>
  (...args: T) =>
    predicates.some((predicate) => predicate(...args));

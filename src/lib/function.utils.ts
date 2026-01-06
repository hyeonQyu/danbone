export const tap = <T>(value: T, interceptor: (value: T) => void): T => {
  interceptor(value);
  return value;
};

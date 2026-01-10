import { getEnv, tap } from '@/lib';

const checkIsProduction = () => getEnv() === 'production';

export const devLog = (...params: unknown[]) => {
  if (checkIsProduction()) return;
  console.log(...params);
};

export const devLogError = (...params: unknown[]) => {
  if (checkIsProduction()) return;
  console.error(...params);
};

export const devLogTap = <T>(value: T, label?: string): T => {
  if (checkIsProduction()) return value;

  return tap(value, (v) => {
    const formattedValue = typeof v === 'object' && v !== null ? JSON.stringify(v, null, 2) : v;

    if (label) {
      devLog(`[${label}]`, formattedValue);
    } else {
      devLog(formattedValue);
    }
  });
};

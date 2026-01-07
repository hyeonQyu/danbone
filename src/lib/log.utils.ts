import { getEnv, tap } from '@/lib';

export const devLog = (...params: unknown[]) => {
  if (getEnv() === 'production') return;
  console.log(...params);
};

export const devLogTap = <T>(value: T, label?: string): T => {
  if (getEnv() === 'production') return value;

  return tap(value, (v) => {
    const formattedValue = typeof v === 'object' && v !== null ? JSON.stringify(v, null, 2) : v;

    if (label) {
      devLog(`[${label}]`, formattedValue);
    } else {
      devLog(formattedValue);
    }
  });
};

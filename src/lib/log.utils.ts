import { getEnv } from '@/lib/env.utils';
import { tap } from '@/lib/function.utils';

export const devLog = (...params: unknown[]) => {
  if (getEnv() === 'production') return;
  console.log(...params);
};

export const devLogTap = <T>(value: T, label?: string): T => {
  if (getEnv() === 'production') return value;

  return tap(value, (v) => {
    if (label) {
      devLog(`[${label}] ${v}`);
    } else {
      devLog(v);
    }
  });
};

import { Env } from '@/lib/env.types';

export const getEnv = (): Env => {
  return process.env.NODE_ENV as Env;
};

'use client';

import { syncTokenToCookie } from '@/auth/token.utils';
import { ERROR_NAME } from '@/errors';

export const serverAction = <TArgs extends unknown[], TResult>(
  action: (...args: TArgs) => Promise<TResult>,
): ((...args: TArgs) => Promise<TResult>) => {
  return async (...args: TArgs) => {
    try {
      return await action(...args);
    } catch (error) {
      if (error instanceof Error) {
        const isExpiredTokenError = error.name === ERROR_NAME.expiredToken;

        if (isExpiredTokenError) {
          const synced = await syncTokenToCookie();
          if (synced) {
            return await action(...args);
          }
        }
      }

      throw error;
    }
  };
};

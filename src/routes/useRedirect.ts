'use client';

import type { AppRoutesPathname } from '@/routes';
import { useTypedRouter } from '@/routes';
import { useCallback } from 'react';

export const useRedirect = (redirectUrl = '/') => {
  const router = useTypedRouter();

  return useCallback(() => {
    const destination = redirectUrl as AppRoutesPathname;
    router.replace(destination);
  }, [redirectUrl, router]);
};

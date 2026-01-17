'use client';

import { useSearchParamsObject } from '@/hooks';
import { useTargetLanguage } from '@/language';
import { useMemo } from 'react';

export const useClientRoutesContext = () => {
  const targetLanguage = useTargetLanguage();
  const searchParams = useSearchParamsObject();

  return useMemo(
    () => ({
      targetLanguage,
      searchParams,
    }),
    [targetLanguage, searchParams],
  );
};

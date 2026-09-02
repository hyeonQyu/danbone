'use client';

import { convertIterableToObject, normalizeToSchema } from '@/lib';
import { useCurrentRouteNode } from '@/routes';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { ZodTypeAny } from 'zod';

export const useSearchParamsObject = (): Record<string, string> => {
  const currentRouteNode = useCurrentRouteNode();
  const searchParams = useSearchParams();
  const searchParamsSchema = currentRouteNode._metadata.searchParamsSchema;

  return useMemo(() => {
    const rawObject = convertIterableToObject(searchParams);
    if (!searchParamsSchema) return rawObject;
    return normalizeToSchema(searchParamsSchema as ZodTypeAny, rawObject);
  }, [searchParams, searchParamsSchema]);
};

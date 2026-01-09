'use client';

import { useSearchParamsObject } from '@/hooks';
import { useTargetLanguage } from '@/language';
import { useCurrentRouteNode } from '@/routes';
import { useMemo } from 'react';

function MetadataTitle() {
  const targetLanguage = useTargetLanguage();
  const searchParams = useSearchParamsObject();
  const currentRouteNode = useCurrentRouteNode();

  const title = useMemo(() => {
    return currentRouteNode?._metadata.title?.({
      client: {
        targetLanguage,
        searchParams,
      },
    });
  }, [searchParams, currentRouteNode, targetLanguage]);

  return <title>{title}</title>;
}

export default MetadataTitle;

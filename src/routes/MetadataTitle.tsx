'use client';

import { useClientRoutesContext, useCurrentRouteNode } from '@/routes';
import { useMemo } from 'react';

function MetadataTitle() {
  const clientRoutesContext = useClientRoutesContext();
  const currentRouteNode = useCurrentRouteNode();

  const title = useMemo(() => {
    return currentRouteNode?._metadata.title?.({
      client: clientRoutesContext,
    });
  }, [clientRoutesContext, currentRouteNode]);

  return <title>{title}</title>;
}

export default MetadataTitle;

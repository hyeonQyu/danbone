'use client';

import { PageViewContainer } from '@/components/PageViewContainer';
import ExploreHomeView from '@/features/explore/ExploreView/ExploreHomeView';
import ExploreSearchView from '@/features/explore/ExploreView/ExploreSearchView';
import { ExploreViewType, useExploreStore } from '@/features/explore/stores';
import { ComponentType } from 'react';

const viewByType: Record<ExploreViewType, ComponentType> = {
  home: ExploreHomeView,
  search: ExploreSearchView,
};

function ExploreView() {
  const viewType = useExploreStore((store) => store.viewType);
  const ViewComponent = viewByType[viewType];

  return (
    <PageViewContainer>
      <ViewComponent />
    </PageViewContainer>
  );
}

export default ExploreView;

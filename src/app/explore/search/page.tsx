'use client';

import { PageViewContainer } from '@/components/PageViewContainer';
import { ExploreSearchView } from '@/features/explore';

function ExploreSearchPage() {
  return (
    <PageViewContainer sx={{ padding: 0 }}>
      <ExploreSearchView />
    </PageViewContainer>
  );
}

export default ExploreSearchPage;

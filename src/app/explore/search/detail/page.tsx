'use client';

import { PageViewContainer } from '@/components/PageViewContainer';
import { SlideInContainer } from '@/components/SlideInContainer';
import { ExploreDictionaryEntryDetailView } from '@/features/explore/components/ExploreDictionaryEntryDetailView';

function ExploreDictionaryEntryDetailPage() {
  return (
    <SlideInContainer>
      <PageViewContainer>
        <ExploreDictionaryEntryDetailView />
      </PageViewContainer>
    </SlideInContainer>
  );
}

export default ExploreDictionaryEntryDetailPage;

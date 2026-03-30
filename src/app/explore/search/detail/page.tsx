'use client';

import { SlideInContainer } from '@/components/SlideInContainer';
import { ExploreDictionaryEntryDetailView } from '@/features/explore/components/ExploreDictionaryEntryDetailView';

function ExploreDictionaryEntryDetailPage() {
  return (
    <SlideInContainer>
      <ExploreDictionaryEntryDetailView />
    </SlideInContainer>
  );
}

export default ExploreDictionaryEntryDetailPage;

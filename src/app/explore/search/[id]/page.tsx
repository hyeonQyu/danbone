'use client';

import { SlideInContainer } from '@/components/SlideInContainer';
import { DictionaryEntryDetailView } from '@/features/dictionary';
import { useTypedSearchParams } from '@/routes';

function ExploreDictionaryEntryDetailPage() {
  const searchParams = useTypedSearchParams('/explore/search/[id]');
  const { id } = searchParams;

  return (
    <SlideInContainer>
      <DictionaryEntryDetailView id={id} addableToVocabularyBook />
    </SlideInContainer>
  );
}

export default ExploreDictionaryEntryDetailPage;

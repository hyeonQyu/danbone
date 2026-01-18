'use client';

import { SlideInContainer } from '@/components/SlideInContainer';
import { DictionaryEntryDetailView } from '@/features/dictionary/components/DictionaryEntryDetailView';
import { useTypedSearchParams } from '@/routes';

function VocabularyEntryDetailPage() {
  const searchParams = useTypedSearchParams('/vocabulary/[id]');
  const { id } = searchParams;

  return (
    <SlideInContainer>
      <DictionaryEntryDetailView id={id} />
    </SlideInContainer>
  );
}

export default VocabularyEntryDetailPage;

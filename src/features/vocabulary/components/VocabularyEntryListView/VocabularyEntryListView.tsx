'use client';

import { ErrorView } from '@/components/ErrorView';
import { JmdictEntity } from '@/features/dictionary';
import { useQueryVocabularyBookDetail } from '@/features/vocabulary/hooks';
import { VocabularyEntryWithLearning } from '@/features/vocabulary/vocabulary.types';
import { useTargetLanguage } from '@/language';
import { useTypedRouter, useTypedSearchParams } from '@/routes';
import { Box, Typography } from '@mui/material';
import EmptyVocabularyEntryList from './EmptyVocabularyEntryList';
import VocabularyEntryJAList from './VocabularyEntryJAList';
import VocabularyEntryListViewSkeleton from './VocabularyEntryListViewSkeleton';
import VocabularyEntryListViewTemplate from './VocabularyEntryListViewTemplate';

function VocabularyEntryListView() {
  const searchParams = useTypedSearchParams('/vocabulary/book/[id]');
  const { id: bookId } = searchParams;

  const targetLanguage = useTargetLanguage();
  const router = useTypedRouter();

  const { data, isLoading, isError, error } = useQueryVocabularyBookDetail(bookId);

  const handleBack = () => router.push('/vocabulary');

  if (isLoading) {
    return (
      <VocabularyEntryListViewTemplate
        book={{ id: bookId, name: '', color: '', entryIds: [], userId: '', targetLanguage, createdAt: new Date(), updatedAt: new Date() }}
        onBack={handleBack}
        renderEntries={() => <VocabularyEntryListViewSkeleton />}
      />
    );
  }

  if (isError || !data) {
    const errorMessage = error instanceof Error ? error.message : '단어장을 불러오는 중 오류가 발생했습니다.';
    return (
      <VocabularyEntryListViewTemplate
        book={{ id: bookId, name: '', color: '', entryIds: [], userId: '', targetLanguage, createdAt: new Date(), updatedAt: new Date() }}
        onBack={handleBack}
        renderEntries={() => <ErrorView title="단어장 로딩 실패" message={errorMessage} />}
      />
    );
  }

  const { book, entries } = data;

  return (
    <VocabularyEntryListViewTemplate
      book={book}
      onBack={handleBack}
      renderEntries={() => {
        if (entries.length === 0) {
          return <EmptyVocabularyEntryList />;
        }

        if (targetLanguage === 'ja') {
          return <VocabularyEntryJAList entries={entries as VocabularyEntryWithLearning<JmdictEntity>[]} />;
        }

        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <Typography variant="body1" color="text.secondary">
              지원하지 않는 언어입니다.
            </Typography>
          </Box>
        );
      }}
    />
  );
}

export default VocabularyEntryListView;

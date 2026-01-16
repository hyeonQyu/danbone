import { getVocabularyBooks } from '@/features/vocabulary/actions/vocabularyBook.actions';
import { VOCABULARY_QUERY_KEY } from '@/features/vocabulary/vocabulary.queryKey';
import { VocabularyBookEntity } from '@/features/vocabulary/vocabulary.types';
import { useTargetLanguage } from '@/language';
import { serverAction, TIME_UNIT } from '@/lib';
import { FetchQueryOptions } from '@tanstack/react-query';
import { useMemo } from 'react';

export const useVocabularyBooksFetchQueryOptions = (): FetchQueryOptions<VocabularyBookEntity[]> => {
  const targetLanguage = useTargetLanguage();

  return useMemo(() => {
    const booksQueryKey = VOCABULARY_QUERY_KEY.books.get(targetLanguage);
    const fetchVocabularyBooks = serverAction(() => getVocabularyBooks(targetLanguage));

    return {
      queryKey: booksQueryKey,
      queryFn: fetchVocabularyBooks,
      gcTime: TIME_UNIT.unitOfMs.asDay,
    };
  }, [targetLanguage]);
};

import { useVocabularyBooksFetchQueryOptions } from '@/features/vocabulary/hooks/useVocabularyBooksFetchQueryOptions';
import { useQuery } from '@tanstack/react-query';

export const useQueryMyVocabularyBooks = () => {
  const vocabularyBooksQueryOptions = useVocabularyBooksFetchQueryOptions();
  return useQuery(vocabularyBooksQueryOptions);
};

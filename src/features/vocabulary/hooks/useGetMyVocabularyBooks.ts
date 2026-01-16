import { useVocabularyBooksFetchQueryOptions } from '@/features/vocabulary/hooks/useVocabularyBooksFetchQueryOptions';
import { useQueryClient } from '@tanstack/react-query';

export const useGetMyVocabularyBooks = () => {
  const queryClient = useQueryClient();
  const vocabularyBooksQueryOption = useVocabularyBooksFetchQueryOptions();
  return () => queryClient.ensureQueryData(vocabularyBooksQueryOption);
};

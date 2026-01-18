import { getVocabularyBookDetail } from '@/features/vocabulary/actions/vocabularyBook.actions';
import { VOCABULARY_QUERY_KEY } from '@/features/vocabulary/vocabulary.queryKey';
import { useTargetLanguage } from '@/language';
import { serverAction, TIME_UNIT } from '@/lib';
import { useQuery } from '@tanstack/react-query';

export const useQueryVocabularyBookDetail = (bookId: string) => {
  const targetLanguage = useTargetLanguage();

  return useQuery({
    queryKey: VOCABULARY_QUERY_KEY.books.getOne(targetLanguage, bookId),
    queryFn: serverAction(() => getVocabularyBookDetail(bookId)),
    gcTime: TIME_UNIT.unitOfMs.asDay,
  });
};

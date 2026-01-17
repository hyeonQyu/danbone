import { addVocabularyToBook } from '@/features/vocabulary/actions/vocabularyBook.actions';
import { serverAction } from '@/lib';
import { enqueueClosableSnackbar } from '@/styles';
import { useMutation } from '@tanstack/react-query';

export const useMutationAddVocabulary = () => {
  return useMutation({
    mutationFn: serverAction(addVocabularyToBook),
    onSuccess: () => {
      enqueueClosableSnackbar({
        message: '단어를 추가했습니다.',
        variant: 'success',
      });
    },
  });
};

import { useDialog } from '@/dialog';
import { useCreateVocabularyBook, useGetMyVocabularyBooks, useVocabularyBooksFetchQueryOptions } from '@/features/vocabulary/hooks';
import { useMutationAddVocabulary } from '@/features/vocabulary/hooks/useMutationAddVocabulary';
import AddIcon from '@mui/icons-material/Add';
import { IconButton, Tooltip } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

interface AddEntryToVocabularyBookButtonProps {
  entryId: string;
}

function AddEntryToVocabularyBookButton({ entryId }: AddEntryToVocabularyBookButtonProps) {
  const queryClient = useQueryClient();
  const dialog = useDialog();

  const vocabularyBooksQueryOption = useVocabularyBooksFetchQueryOptions();
  const getMyVocabularyBooks = useGetMyVocabularyBooks();
  const createVocabularyBook = useCreateVocabularyBook();
  const { mutateAsync: addVocabulary } = useMutationAddVocabulary();

  const handleClick = async () => {
    const books = await getMyVocabularyBooks();

    if (books.length === 0) {
      const confirmResult = await dialog.confirm({
        title: '단어장이 없습니다',
        content: '단어를 추가할 단어장을 먼저 생성합니다.',
      });

      if (!confirmResult) return;

      const createBookResult = await createVocabularyBook();

      if (createBookResult?.book) {
        await Promise.all([
          queryClient.prefetchQuery(vocabularyBooksQueryOption),
          addVocabulary({ bookId: createBookResult.book.id, entryId }),
        ]);
      }

      return;
    }
  };

  return (
    <Tooltip title="단어장에 추가" arrow>
      <IconButton onClick={handleClick} color="primary" size="medium" aria-label="단어장에 추가">
        <AddIcon />
      </IconButton>
    </Tooltip>
  );
}

export default AddEntryToVocabularyBookButton;

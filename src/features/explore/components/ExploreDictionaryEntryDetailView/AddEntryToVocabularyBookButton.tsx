import { useDialog } from '@/dialog';
import { getVocabularyBooks } from '@/features/vocabulary/actions/vocabularyBook.actions';
import { VocabularyBookAddDialog } from '@/features/vocabulary/components/VocabularyBookAddDialog';
import { VOCABULARY_QUERY_KEY } from '@/features/vocabulary/vocabulary.queryKey';
import { useTargetLanguage } from '@/language';
import { serverAction, TIME_UNIT } from '@/lib';
import AddIcon from '@mui/icons-material/Add';
import { IconButton, Tooltip } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

function AddEntryToVocabularyBookButton() {
  const targetLanguage = useTargetLanguage();

  const queryClient = useQueryClient();

  const getMyVocabularyBooks = () =>
    queryClient.ensureQueryData({
      queryKey: VOCABULARY_QUERY_KEY.books.get(targetLanguage),
      queryFn: serverAction(() => getVocabularyBooks(targetLanguage)),
      gcTime: TIME_UNIT.unitOfMs.asDay,
    });

  const dialog = useDialog();

  const handleClick = async () => {
    const books = await getMyVocabularyBooks();

    if (books.length === 0) {
      const result = await dialog.open<{ created: boolean }>({
        fullScreen: true,
        content: (close) => <VocabularyBookAddDialog targetLanguage={targetLanguage} onClose={close} />,
      });

      if (result?.created) {
        // 캐시 무효화하여 새로 생성된 단어장 목록 갱신
        await queryClient.invalidateQueries({
          queryKey: VOCABULARY_QUERY_KEY.books.get(targetLanguage),
        });
      }
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

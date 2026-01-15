import { getVocabularyBooks } from '@/features/vocabulary/actions/vocabularyBook.actions';
import { useTargetLanguage } from '@/language';
import AddIcon from '@mui/icons-material/Add';
import { IconButton, Tooltip } from '@mui/material';

function VocabularyBookAddButton() {
  const targetLanguage = useTargetLanguage();

  const handleClick = async () => {
    const books = await getVocabularyBooks(targetLanguage);
    console.log(books);
  };

  return (
    <Tooltip title="단어장에 추가" arrow>
      <IconButton onClick={handleClick} color="primary" size="medium" aria-label="단어장에 추가">
        <AddIcon />
      </IconButton>
    </Tooltip>
  );
}

export default VocabularyBookAddButton;

import { Add } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';

interface EmptyVocabularyBookListProps {
  onCreateBook: () => void;
}

function EmptyVocabularyBookList({ onCreateBook }: EmptyVocabularyBookListProps) {
  return (
    <Box
      sx={{
        py: 8,
        px: 3,
        textAlign: 'center',
        borderRadius: 2,
        border: '1px dashed',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}
    >
      <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
        아직 단어장이 없습니다
      </Typography>
      <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
        새 단어장을 만들어 단어를 저장해보세요
      </Typography>
      <Button variant="outlined" startIcon={<Add />} onClick={onCreateBook}>
        첫 단어장 만들기
      </Button>
    </Box>
  );
}

export default EmptyVocabularyBookList;

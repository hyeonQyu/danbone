import { BookmarkBorder } from '@mui/icons-material';
import { Box, Typography, useTheme } from '@mui/material';

function EmptyVocabularyEntryList() {
  const { palette, spacing } = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        gap: spacing(2),
      }}
    >
      <BookmarkBorder
        sx={{
          fontSize: 64,
          color: palette.text.disabled,
        }}
      />
      <Typography variant="h6" color="text.secondary">
        단어장에 단어가 없습니다
      </Typography>
      <Typography variant="body2" color="text.secondary">
        탐색 페이지에서 단어를 추가해보세요
      </Typography>
    </Box>
  );
}

export default EmptyVocabularyEntryList;

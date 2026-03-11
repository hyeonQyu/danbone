import { ExploreSearchResult } from '@/features/explore/types';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { ReactNode } from 'react';

interface ExploreSearchResultCardTemplateProps<TDictionaryWord extends object> {
  result: ExploreSearchResult<TDictionaryWord>;
  renderWord: (word: TDictionaryWord) => ReactNode;
}

function ExploreSearchResultCardTemplate<TDictionaryWord extends object>({
  result,
  renderWord,
}: ExploreSearchResultCardTemplateProps<TDictionaryWord>) {
  const { text, words } = result;

  const { spacing, shape, palette } = useTheme();

  return (
    <Box
      sx={{
        p: spacing(2),
        borderRadius: shape.borderRadius,
        backgroundColor: palette.background.paper,
        border: `1px solid ${palette.divider}`,
      }}
    >
      <Box sx={{ mb: spacing(2) }}>
        <Typography variant="h5" gutterBottom color="textSecondary">
          {text}
        </Typography>
      </Box>

      <Stack spacing={spacing(3)}>
        {words.map((word, index) => (
          <Box key={index} sx={{ mb: spacing(1) }}>
            {renderWord(word)}
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

export default ExploreSearchResultCardTemplate;

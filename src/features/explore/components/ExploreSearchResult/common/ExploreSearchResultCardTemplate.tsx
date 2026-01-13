import { ExploreSearchResult } from '@/features/explore/types';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { ReactNode } from 'react';

interface ExploreSearchResultCardTemplateProps<TDictionaryEntry extends object> {
  result: ExploreSearchResult<TDictionaryEntry>;
  renderEntry: (entry: TDictionaryEntry) => ReactNode;
}

function ExploreSearchResultCardTemplate<TDictionaryEntry extends object>({
  result,
  renderEntry,
}: ExploreSearchResultCardTemplateProps<TDictionaryEntry>) {
  const { text, entries } = result;

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
        {entries.map((entry, index) => (
          <Box key={index} sx={{ mb: spacing(1) }}>
            {renderEntry(entry)}
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

export default ExploreSearchResultCardTemplate;

import { DictionaryEntryByLanguage } from '@/openai';
import { Box, Typography, useTheme } from '@mui/material';
import DictionaryJAEntryResultCard from './DictionaryJAEntryResultCard';

interface DictionaryJAEntryProps {
  entry: DictionaryEntryByLanguage['ja'];
}

function DictionaryJAEntry({ entry }: DictionaryJAEntryProps) {
  const { keyword, results } = entry;
  const { spacing } = useTheme();

  return (
    <Box>
      <Box sx={{ mb: spacing(2) }}>
        <Typography variant="h5">{keyword}</Typography>
        <Typography variant="caption" color="text.secondary">
          {results.length}개의 결과
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: spacing(2) }}>
        {results.map((result, index) => (
          <DictionaryJAEntryResultCard key={index} result={result} />
        ))}
      </Box>
    </Box>
  );
}

export default DictionaryJAEntry;

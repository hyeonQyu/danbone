import { DictionaryWordByLanguage } from '@/openai';
import { Box, Typography, useTheme } from '@mui/material';
import DictionaryJAEntryCard from './DictionaryJAEntryCard';

interface DictionaryJAWordProps {
  word: DictionaryWordByLanguage['ja'];
}

function DictionaryJAWord({ word }: DictionaryJAWordProps) {
  const { keyword, entries } = word;
  const { spacing } = useTheme();

  return (
    <Box>
      <Box sx={{ mb: spacing(2) }}>
        <Typography variant="h5">{keyword}</Typography>
        <Typography variant="caption" color="text.secondary">
          {entries.length}개의 결과
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: spacing(2) }}>
        {entries.map((entry, index) => (
          <DictionaryJAEntryCard key={index} entry={entry} />
        ))}
      </Box>
    </Box>
  );
}

export default DictionaryJAWord;

import { useGetJAPartOfSpeechLabel } from '@/features/dictionary';
import { DictionaryEntryByLanguage } from '@/features/dictionary/dictionary.types';
import { usePxToRem } from '@/styles';
import { Box, Chip, Typography, useTheme } from '@mui/material';
import { DictionaryOrderedListSection } from '../common';

interface DictionaryJAEntryDetailProps {
  entry: DictionaryEntryByLanguage['ja'];
}

function DictionaryJAEntryDetail({ entry }: DictionaryJAEntryDetailProps) {
  const { notations, pronunciations, meanings, partOfSpeeches, examples } = entry;

  const { spacing } = useTheme();
  const pxToRem = usePxToRem();

  const getPartOfSpeechLabel = useGetJAPartOfSpeechLabel();

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: pxToRem(900),
        mx: 'auto',
        py: { xs: spacing(4), md: spacing(6) },
        px: { xs: spacing(2), sm: spacing(3) },
      }}
    >
      <Box sx={{ mb: spacing(5) }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '2rem', md: '3rem' },
            mb: spacing(2),
          }}
        >
          {notations.map((notation, index) => (
            <Box
              key={index}
              component="span"
              sx={{
                display: 'inline-block',
                whiteSpace: 'nowrap',
              }}
            >
              {notation}
              {index < notations.length - 1 && (
                <Box component="span" sx={{ ml: 0.2, mr: 0.8 }}>
                  ,
                </Box>
              )}
            </Box>
          ))}
        </Typography>
        <Box sx={{ mb: spacing(2) }}>
          <Chip label={getPartOfSpeechLabel(partOfSpeeches)} color="primary" sx={{ fontWeight: 600, fontSize: '0.95rem' }} />
        </Box>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            fontSize: { xs: '1.2rem', md: '1.3rem' },
          }}
        >
          [
          {pronunciations.map((pronunciation, index) => (
            <Box
              key={index}
              component="span"
              sx={{
                display: 'inline-block',
                whiteSpace: 'nowrap',
              }}
            >
              {pronunciation}
              {index < pronunciations.length - 1 && (
                <Box component="span" sx={{ ml: 0.8, mr: 0.8 }}>
                  /
                </Box>
              )}
            </Box>
          ))}
          ]
        </Typography>
      </Box>

      <DictionaryOrderedListSection title="의미" items={meanings} />
      {/* <DictionaryOrderedListSection title="예문" items={examples} /> */}
    </Box>
  );
}

export default DictionaryJAEntryDetail;

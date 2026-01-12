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
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'baseline', mb: spacing(2) }}>
          {notations.map((notation, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'baseline' }}>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', md: '3rem' },
                }}
              >
                {notation}
              </Typography>
              {index < notations.length - 1 && (
                <Typography
                  variant="h3"
                  component="span"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', md: '3rem' },
                  }}
                >
                  ,
                </Typography>
              )}
            </Box>
          ))}
        </Box>
        <Box sx={{ mb: spacing(2) }}>
          <Chip label={getPartOfSpeechLabel(partOfSpeeches)} color="primary" sx={{ fontWeight: 600, fontSize: '0.95rem' }} />
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'baseline' }}>
          {pronunciations.map((pronunciation, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'baseline' }}>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                }}
              >
                [{pronunciation}]
              </Typography>
              {index < pronunciations.length - 1 && (
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: '1.1rem', md: '1.3rem' },
                  }}
                >
                  ,
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ mb: spacing(5) }}>
        <DictionaryOrderedListSection title="의미" items={meanings} />
      </Box>

      <DictionaryOrderedListSection title="예문" items={examples} />
    </Box>
  );
}

export default DictionaryJAEntryDetail;

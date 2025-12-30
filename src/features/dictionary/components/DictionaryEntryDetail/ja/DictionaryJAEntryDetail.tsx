import { useGetJAPartOfSpeechLabel } from '@/features/dictionary';
import { DictionaryEntryByLanguage } from '@/features/dictionary/dictionary.types';
import { usePxToRem } from '@/styles';
import { FormatQuote } from '@mui/icons-material';
import { Box, Chip, Typography, useTheme } from '@mui/material';

interface DictionaryJAEntryDetailProps {
  entry: DictionaryEntryByLanguage['ja'];
}

function DictionaryJAEntryDetail({ entry }: DictionaryJAEntryDetailProps) {
  const { notation, pronunciation, meanings, pos, examples } = entry;

  const { spacing, palette } = useTheme();
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: spacing(2), mb: spacing(1.5), flexWrap: 'wrap' }}>
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
          <Chip label={getPartOfSpeechLabel(pos)} color="primary" sx={{ fontWeight: 600, fontSize: '0.95rem' }} />
        </Box>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            fontSize: { xs: '1.1rem', md: '1.3rem' },
            mb: spacing(4),
          }}
        >
          [{pronunciation}]
        </Typography>
      </Box>

      <Box sx={{ mb: spacing(6) }}>
        <Typography
          variant="h5"
          sx={{
            mb: spacing(3),
            fontWeight: 700,
            fontSize: { xs: '1.5rem', md: '1.75rem' },
          }}
        >
          의미
        </Typography>
        <Box
          component="ol"
          sx={{
            pl: spacing(4),
            m: 0,
            '& li': {
              mb: spacing(2),
              '&::marker': {
                color: palette.primary.main,
                fontWeight: 700,
              },
            },
          }}
        >
          {meanings.map((meaning, index) => (
            <Typography
              key={index}
              component="li"
              variant="body1"
              sx={{
                fontSize: { xs: '1.1rem', md: '1.2rem' },
                lineHeight: 1.8,
              }}
            >
              {meaning}
            </Typography>
          ))}
        </Box>
      </Box>

      <Box>
        <Typography
          variant="h5"
          sx={{
            mb: spacing(3),
            fontWeight: 700,
            fontSize: { xs: '1.5rem', md: '1.75rem' },
          }}
        >
          예문
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: spacing(3) }}>
          {examples.map((example, index) => (
            <Box
              key={index}
              sx={{
                position: 'relative',
                pl: spacing(4),
                borderLeft: `3px solid ${palette.primary.main}`,
              }}
            >
              <FormatQuote
                sx={{
                  position: 'absolute',
                  left: spacing(0),
                  top: spacing(-0.5),
                  fontSize: '1rem',
                  color: palette.primary.main,
                  opacity: 0.2,
                }}
              />

              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1.1rem', md: '1.2rem' },
                  lineHeight: 2,
                  fontStyle: 'italic',
                  color: palette.text.secondary,
                }}
              >
                {example}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default DictionaryJAEntryDetail;

import { useGetJAPartOfSpeechLabel } from '@/features/dictionary';
import { DictionaryWordByLanguage } from '@/openai';
import { useTypedRouter } from '@/routes';
import { usePxToRem } from '@/styles';
import { Box, Chip, Typography, useTheme } from '@mui/material';

interface DictionaryJAEntryCardProps {
  entry: DictionaryWordByLanguage['ja']['entries'][number];
}

function DictionaryJAEntryCard({ entry }: DictionaryJAEntryCardProps) {
  const { notations, pronunciations, meanings, partOfSpeeches } = entry;

  const { spacing, palette, transitions, shadows } = useTheme();
  const pxToRem = usePxToRem();

  const router = useTypedRouter();

  const getPartOfSpeechLabel = useGetJAPartOfSpeechLabel();

  const handleClick = () => {
    router.push('/explore/search/detail', {
      searchParams: {
        language: 'ja',
        ...entry,
      },
    });
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        p: spacing(2),
        borderRadius: spacing(1),
        backgroundColor: palette.background.default,
        border: `1px solid ${palette.divider}`,
        cursor: 'pointer',
        userSelect: 'none',
        boxShadow: shadows[2],
        WebkitTapHighlightColor: 'transparent',
        transition: transitions.create(['box-shadow', 'transform', 'border-color', 'background-color'], {
          duration: transitions.duration.shorter,
        }),
        '@media (hover: hover)': {
          '&:hover': {
            boxShadow: shadows[4],
            transform: `translateY(-${pxToRem(2)})`,
          },
        },
        '@media (hover: none)': {
          boxShadow: shadows[4],
        },
        '&:active': {
          transform: `translateY(${pxToRem(1)})`,
          boxShadow: shadows[1],
          backgroundColor: palette.action.selected,
        },
      }}
    >
      <Box sx={{ mb: spacing(1), display: 'flex', alignItems: 'center', gap: spacing(1), flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'baseline' }}>
          {notations.map((notation, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'baseline' }}>
              <Typography variant="subtitle1" component="span" sx={{ fontWeight: 600 }}>
                {notation}
              </Typography>
              {index < notations.length - 1 && (
                <Typography variant="subtitle1" component="span">
                  ,
                </Typography>
              )}
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'baseline' }}>
          {pronunciations.map((pronunciation, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'baseline' }}>
              <Typography variant="body2" color="text.secondary" component="span">
                [{pronunciation}]
              </Typography>
              {index < pronunciations.length - 1 && (
                <Typography variant="body2" color="text.secondary" component="span">
                  ,
                </Typography>
              )}
            </Box>
          ))}
        </Box>
        <Chip label={getPartOfSpeechLabel(partOfSpeeches)} size="small" sx={{ ml: 'auto' }} variant="filled" />
      </Box>

      <Box>
        {meanings.map((meaning, index) => (
          <Typography key={index} variant="body2" color="text.secondary" sx={{ pl: spacing(1), mb: spacing(0.5) }}>
            {index + 1}. {meaning}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}

export default DictionaryJAEntryCard;

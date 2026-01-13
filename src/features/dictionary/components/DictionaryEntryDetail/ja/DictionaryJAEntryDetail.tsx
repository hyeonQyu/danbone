import { useGetJAPartOfSpeechLabel } from '@/features/dictionary';
import { DictionaryEntryByLanguage } from '@/features/dictionary/dictionary.types';
import { usePxToRem } from '@/styles';
import { Box, Chip, Typography, useTheme } from '@mui/material';

interface DictionaryJAEntryDetailProps {
  entry: DictionaryEntryByLanguage['ja'];
}

function DictionaryJAEntryDetail({ entry }: DictionaryJAEntryDetailProps) {
  const { kanji, kana, sense } = entry;
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
      {/* 표제어 섹션 */}
      <Box sx={{ mb: spacing(5) }}>
        {/* Kanji 표기들 */}
        {kanji.length > 0 && (
          <Box sx={{ mb: spacing(2) }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2rem', md: '3rem' },
                mb: spacing(1),
              }}
            >
              {kanji.map((k, i) => (
                <Box key={i} component="span">
                  {k.text}
                  {k.common && <Chip label="常用" size="small" sx={{ ml: 1 }} />}
                  {i < kanji.length - 1 && (
                    <Box component="span" sx={{ mx: 1 }}>
                      ·
                    </Box>
                  )}
                </Box>
              ))}
            </Typography>
            {/* Kanji tags 표시 */}
            {kanji.some((k) => k.tags.length > 0) && (
              <Box sx={{ mt: 1 }}>
                {kanji
                  .flatMap((k) => k.tags)
                  .map((tag, i) => (
                    <Chip key={i} label={tag} size="small" variant="outlined" sx={{ mr: 0.5 }} />
                  ))}
              </Box>
            )}
          </Box>
        )}

        {/* Kana 표기들 */}
        <Box sx={{ mb: spacing(2) }}>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              fontSize: { xs: '1.2rem', md: '1.3rem' },
            }}
          >
            [
            {kana.map((k, i) => (
              <Box key={i} component="span">
                {k.text}
                {k.common && <Chip label="常用" size="small" sx={{ ml: 1 }} />}
                {i < kana.length - 1 && (
                  <Box component="span" sx={{ mx: 1 }}>
                    ·
                  </Box>
                )}
              </Box>
            ))}
            ]
          </Typography>
        </Box>
      </Box>

      {/* Sense(의미) 섹션들 */}
      {sense.map((s, senseIndex) => (
        <Box
          key={senseIndex}
          sx={{
            mb: spacing(4),
            pb: spacing(3),
            borderBottom: senseIndex < sense.length - 1 ? '1px solid' : 'none',
            borderColor: 'divider',
          }}
        >
          {/* 품사 */}
          <Box sx={{ mb: spacing(2) }}>
            <Chip label={getPartOfSpeechLabel(s.partOfSpeech)} color="primary" sx={{ fontWeight: 600 }} />
          </Box>

          {/* appliesToKana */}
          {s.appliesToKana.length > 0 && (
            <Box sx={{ mb: spacing(1) }}>
              <Typography variant="caption" color="text.secondary">
                적용 대상 읽기: {s.appliesToKana.join(', ')}
              </Typography>
            </Box>
          )}

          {/* Gloss(의미) */}
          <Box sx={{ mb: spacing(2) }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              의미
            </Typography>
            {s.gloss.map((g, gIndex) => (
              <Typography key={gIndex} variant="body1" sx={{ pl: spacing(2), mb: spacing(0.5) }}>
                {gIndex + 1}. {g.text}
                {g.type && <Chip label={g.type} size="small" sx={{ ml: 1 }} />}
              </Typography>
            ))}
          </Box>

          {/* Misc tags */}
          {s.misc.length > 0 && (
            <Box sx={{ mb: spacing(1) }}>
              <Typography variant="caption" color="text.secondary">
                속성:{' '}
              </Typography>
              {s.misc.map((m, i) => (
                <Chip key={i} label={m} size="small" variant="outlined" sx={{ mr: 0.5, mb: 0.5 }} />
              ))}
            </Box>
          )}

          {/* Dialect */}
          {s.dialect.length > 0 && (
            <Box sx={{ mb: spacing(1) }}>
              <Typography variant="caption" color="text.secondary">
                방언:{' '}
              </Typography>
              {s.dialect.map((d, i) => (
                <Chip key={i} label={d} size="small" color="secondary" sx={{ mr: 0.5 }} />
              ))}
            </Box>
          )}

          {/* Field */}
          {s.field.length > 0 && (
            <Box sx={{ mb: spacing(1) }}>
              <Typography variant="caption" color="text.secondary">
                분야:{' '}
              </Typography>
              {s.field.map((f, i) => (
                <Chip key={i} label={f} size="small" sx={{ mr: 0.5 }} />
              ))}
            </Box>
          )}

          {/* Info */}
          {s.info.length > 0 && (
            <Box sx={{ mb: spacing(1) }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                {s.info.join(' · ')}
              </Typography>
            </Box>
          )}

          {/* Related/Antonym */}
          {(s.related.length > 0 || s.antonym.length > 0) && (
            <Box>
              {s.related.length > 0 && (
                <Typography variant="caption" color="text.secondary">
                  관련어: {JSON.stringify(s.related)}
                </Typography>
              )}
              {s.antonym.length > 0 && (
                <Typography variant="caption" color="text.secondary">
                  반의어: {JSON.stringify(s.antonym)}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
}

export default DictionaryJAEntryDetail;

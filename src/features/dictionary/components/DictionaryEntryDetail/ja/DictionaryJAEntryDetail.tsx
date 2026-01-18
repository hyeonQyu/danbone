import {
  DictionaryEntryByLanguage,
  useGetJADialectLabel,
  useGetJAGlossTypeLabel,
  useGetJAKanaTagLabel,
  useGetJAKanjiTagLabel,
  useGetJAMiscLabel,
  useGetJAPartOfSpeechLabel,
} from '@/features/dictionary';
import StarIcon from '@mui/icons-material/Star';
import { Box, Chip, Divider, Typography, useTheme } from '@mui/material';

interface DictionaryJAEntryDetailProps {
  entry: DictionaryEntryByLanguage['ja'];
}

function DictionaryJAEntryDetail({ entry }: DictionaryJAEntryDetailProps) {
  const { kanji, kana, sense } = entry;
  const { spacing, palette } = useTheme();
  const getPartOfSpeechLabel = useGetJAPartOfSpeechLabel();
  const getKanjiTagLabel = useGetJAKanjiTagLabel();
  const getKanaTagLabel = useGetJAKanaTagLabel();
  const getDialectLabel = useGetJADialectLabel();
  const getMiscLabel = useGetJAMiscLabel();
  const getGlossTypeLabel = useGetJAGlossTypeLabel();

  return (
    <Box
      sx={{
        width: '100%',
        mx: 'auto',
      }}
    >
      {/* 표제어 섹션 */}
      <Box sx={{ mb: spacing(4) }}>
        {/* Kanji 표기들 */}
        {kanji.length > 0 && (
          <Box sx={{ mb: spacing(3) }}>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontWeight: 600,
                mb: 0.5,
                display: 'block',
                fontSize: { xs: '0.75rem', md: '0.8rem' },
              }}
            >
              한자 표기
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: spacing(1.5) }}>
              {kanji.map((k, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                  <Typography
                    variant="h4"
                    component="span"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: '1.75rem', md: '2rem' },
                      lineHeight: 1.3,
                    }}
                  >
                    {k.text}
                  </Typography>
                  {k.common && (
                    <StarIcon
                      sx={{
                        fontSize: { xs: '1.2rem', md: '1.4rem' },
                        color: palette.warning.main,
                      }}
                    />
                  )}
                  {k.tags.map((tag, tagIndex) => (
                    <Chip
                      key={tagIndex}
                      label={getKanjiTagLabel([tag])}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem', height: 20, ml: 0.5 }}
                    />
                  ))}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Kana 표기들 */}
        <Box sx={{ mb: spacing(1) }}>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
              mb: 0.5,
              display: 'block',
              fontSize: { xs: '0.75rem', md: '0.8rem' },
            }}
          >
            가나 표기
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: spacing(1.5) }}>
            {kana.map((k, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                <Typography
                  variant="h4"
                  component="span"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '1.75rem', md: '2rem' },
                    lineHeight: 1.3,
                  }}
                >
                  {k.text}
                </Typography>
                {k.common && (
                  <StarIcon
                    sx={{
                      fontSize: { xs: '1.2rem', md: '1.4rem' },
                      color: palette.warning.main,
                    }}
                  />
                )}
                {k.tags.map((tag, tagIndex) => (
                  <Chip
                    key={tagIndex}
                    label={getKanaTagLabel([tag])}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem', height: 20 }}
                  />
                ))}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mb: spacing(3) }} />

      {/* Sense(의미) 섹션들 */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: spacing(3) }}>
        {sense.map((s, senseIndex) => {
          return (
            <Box
              key={senseIndex}
              sx={{
                borderBottom: senseIndex < sense.length - 1 ? '1px solid' : 'none',
                borderColor: 'divider',
              }}
            >
              {/* 품사 */}
              <Box sx={{ mb: spacing(2) }}>
                <Chip
                  label={getPartOfSpeechLabel(s.partOfSpeech)}
                  color="primary"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', md: '0.9rem' },
                    height: { xs: 28, md: 32 },
                  }}
                />
              </Box>

              {/* 의미(Gloss) - 한국어만 */}
              {s.gloss.length > 0 && (
                <Box sx={{ mb: spacing(2) }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      color: 'text.primary',
                      fontSize: { xs: '0.9rem', md: '1rem' },
                    }}
                  >
                    의미
                  </Typography>
                  {s.gloss.map((g, gIndex) => (
                    <Box key={gIndex} sx={{ mb: spacing(1) }}>
                      <Typography
                        variant="body1"
                        sx={{
                          pl: spacing(2),
                          fontSize: { xs: '1rem', md: '1.1rem' },
                          lineHeight: 1.6,
                          fontWeight: 500,
                        }}
                      >
                        {gIndex + 1}. {g.text}
                        {g.type && (
                          <Chip
                            label={getGlossTypeLabel(g.type)}
                            size="small"
                            sx={{
                              ml: 1,
                              height: 20,
                              fontSize: '0.7rem',
                            }}
                          />
                        )}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}

              {/* 기타 속성들 */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: spacing(1.5) }}>
                {/* Misc tags */}
                {s.misc.length > 0 && (
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: 'text.secondary',
                        display: 'block',
                        mb: 0.5,
                        fontSize: { xs: '0.75rem', md: '0.8rem' },
                      }}
                    >
                      속성
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {s.misc.map((m, i) => (
                        <Chip key={i} label={getMiscLabel([m])} size="small" variant="outlined" sx={{ fontSize: '0.75rem' }} />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Dialect */}
                {s.dialect.length > 0 && (
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: 'text.secondary',
                        display: 'block',
                        mb: 0.5,
                        fontSize: { xs: '0.75rem', md: '0.8rem' },
                      }}
                    >
                      방언
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {s.dialect.map((d, i) => (
                        <Chip key={i} label={getDialectLabel([d])} size="small" color="secondary" sx={{ fontSize: '0.75rem' }} />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Field */}
                {s.field.length > 0 && (
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: 'text.secondary',
                        display: 'block',
                        mb: 0.5,
                        fontSize: { xs: '0.75rem', md: '0.8rem' },
                      }}
                    >
                      분야
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {s.field.map((f, i) => (
                        <Chip key={i} label={f} size="small" sx={{ fontSize: '0.75rem' }} />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Info */}
                {s.info.length > 0 && (
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: 'text.secondary',
                        display: 'block',
                        mb: 0.5,
                        fontSize: { xs: '0.75rem', md: '0.8rem' },
                      }}
                    >
                      추가 정보
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        fontStyle: 'italic',
                        fontSize: { xs: '0.85rem', md: '0.9rem' },
                        lineHeight: 1.5,
                      }}
                    >
                      {s.info.join(' · ')}
                    </Typography>
                  </Box>
                )}

                {/* Related */}
                {s.related.length > 0 && (
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: 'text.secondary',
                        display: 'block',
                        mb: 0.5,
                        fontSize: { xs: '0.75rem', md: '0.8rem' },
                      }}
                    >
                      관련어
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        fontSize: { xs: '0.85rem', md: '0.9rem' },
                      }}
                    >
                      {s.related.map((r) => (typeof r === 'string' ? r : JSON.stringify(r))).join(', ')}
                    </Typography>
                  </Box>
                )}

                {/* Antonym */}
                {s.antonym.length > 0 && (
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: 'text.secondary',
                        display: 'block',
                        mb: 0.5,
                        fontSize: { xs: '0.75rem', md: '0.8rem' },
                      }}
                    >
                      반의어
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        fontSize: { xs: '0.85rem', md: '0.9rem' },
                      }}
                    >
                      {s.antonym.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(', ')}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default DictionaryJAEntryDetail;

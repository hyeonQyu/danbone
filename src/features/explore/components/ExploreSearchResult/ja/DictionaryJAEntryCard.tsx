import { useGetJAPartOfSpeechLabel } from '@/features/dictionary';
import { DictionaryEntryByLanguage } from '@/features/dictionary/dictionary.types';
import { JmdictKana, JmdictKanji, JmdictKanjiTag } from '@/features/dictionary/jmdict.types';
import { overSome } from '@/lib';
import { usePxToRem } from '@/styles';
import { Box, Chip, Typography, useTheme } from '@mui/material';

interface DictionaryJAEntryCardProps {
  entry: DictionaryEntryByLanguage['ja'];
  onClick?: (entry: DictionaryEntryByLanguage['ja']) => void;
}

const MAX_PRIMARY_MEANINGS = 2;

const getCommon = ({ common }: { common: boolean }) => common;

const filterSearchOnlyNotations = (kanji: JmdictKanji[], kana: JmdictKana[]) => ({
  validKanji: kanji.filter(({ tags }) => !tags.includes('sK')),
  validKana: kana.filter(({ tags }) => !tags.includes('sk')),
});

const checkHasOnlyKanaCommon = (kana: JmdictKana[], kanji: JmdictKanji[]) => {
  const hasCommonKana = kana.some(getCommon);
  const hasCommonKanji = kanji.some(getCommon);
  return hasCommonKana && !hasCommonKanji;
};

const checkKanjiTag = (compareTag: JmdictKanjiTag) => (tag: JmdictKanjiTag) => tag === compareTag;

const shouldPreferKanaOverKanji = (kanji: JmdictKanji, kana: JmdictKana[]) => {
  return kanji.tags.some(overSome(checkKanjiTag('rK'), checkKanjiTag('oK'))) && kana.length > 0;
};

const getFirstCommonKana = (kana: JmdictKana[]) => {
  return kana.find(getCommon)!.text;
};

const selectBestNotation = ({ kanji, kana }: { kanji: JmdictKanji[]; kana: JmdictKana[] }) => {
  const { validKanji, validKana } = filterSearchOnlyNotations(kanji, kana);

  if (checkHasOnlyKanaCommon(validKana, validKanji)) {
    return getFirstCommonKana(validKana);
  }

  if (validKanji.length > 0) {
    const firstKanji = validKanji[0];

    if (shouldPreferKanaOverKanji(firstKanji, validKana)) {
      return validKana[0].text;
    }

    return firstKanji.text;
  }

  return validKana[0].text;
};

const calculateTotalNotations = (validKanji: JmdictKanji[], validKana: JmdictKana[]) => {
  return validKanji.length + (validKanji.length === 0 ? validKana.length : 0);
};

const getFirstReading = (kana: JmdictKana[]) => kana[0].text;

const getPrimaryPartOfSpeech = (sense: DictionaryEntryByLanguage['ja']['sense']) => {
  return sense[0]?.partOfSpeech[0];
};

const getPrimaryMeanings = (sense: DictionaryEntryByLanguage['ja']['sense']) => {
  return sense
    .slice(0, MAX_PRIMARY_MEANINGS)
    .map(({ gloss }) => gloss[0]?.text)
    .filter(Boolean);
};

const calculateRemainingSenseCount = (totalSenseCount: number) => {
  return Math.max(0, totalSenseCount - 2);
};

function DictionaryJAEntryCard({ entry, onClick }: DictionaryJAEntryCardProps) {
  const { kanji, kana, sense } = entry;

  const notation = selectBestNotation({ kanji, kana });

  const { validKanji, validKana } = filterSearchOnlyNotations(kanji, kana);
  const totalNotations = calculateTotalNotations(validKanji, validKana);
  const hasMoreNotations = totalNotations > 1;

  const reading = getFirstReading(kana);
  const primaryPos = getPrimaryPartOfSpeech(sense);
  const primaryMeanings = getPrimaryMeanings(sense);
  const remainingSenseCount = calculateRemainingSenseCount(sense.length);

  const { spacing, palette, transitions, shadows } = useTheme();
  const pxToRem = usePxToRem();

  const getPartOfSpeechLabel = useGetJAPartOfSpeechLabel();

  const handleClick = () => onClick?.(entry);

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
      <Box
        sx={{
          mb: spacing(1),
          display: 'flex',
          alignItems: 'center',
          gap: spacing(1),
          flexWrap: 'wrap',
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {notation}
          {hasMoreNotations && (
            <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
              ...
            </Typography>
          )}
        </Typography>

        {kanji.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            [{reading}]
          </Typography>
        )}

        {primaryPos && <Chip label={getPartOfSpeechLabel([primaryPos])} size="small" sx={{ ml: 'auto' }} variant="filled" />}
      </Box>

      <Box>
        {primaryMeanings.map((meaning, index) => (
          <Typography key={index} variant="body2" color="text.secondary" sx={{ pl: spacing(1), mb: spacing(0.5) }}>
            {index + 1}. {meaning}
          </Typography>
        ))}

        {remainingSenseCount > 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ pl: spacing(1), fontStyle: 'italic' }}>
            외 {remainingSenseCount}개 의미
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default DictionaryJAEntryCard;

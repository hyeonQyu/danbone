'use client';

import { SearchInputField } from '@/components/SearchInputField';
import { useExploreStore } from '@/features/explore/stores';
import { useGetLanguageLabel } from '@/language';
import { Language } from '@/language/language.types';
import { useSourceLanguage, useTargetLanguage } from '@/language/LanguageContext';
import { useTypedRouter } from '@/routes/routes';
import { usePxToRem } from '@/styles';
import { Box, FormControl, MenuItem, Select, SelectChangeEvent, Typography, useTheme } from '@mui/material';

function ExploreView() {
  const sourceLanguage = useSourceLanguage();
  const targetLanguage = useTargetLanguage();
  const getLanguageLabel = useGetLanguageLabel();

  const { palette, spacing, shadows } = useTheme();
  const pxToRem = usePxToRem();

  const router = useTypedRouter();

  const queryLanguage = useExploreStore((store) => store.queryLanguage);
  const setQueryLanguage = useExploreStore((store) => store.setQueryLanguage);

  const handleLanguageChange = (event: SelectChangeEvent<Language>) => {
    setQueryLanguage(event.target.value as Language);
  };

  const handleSearchClick = () => {
    router.push('/explore/search');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: palette.text.primary,
        }}
      >
        단어 & 문장 탐색
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: palette.text.secondary,
          marginTop: spacing(1),
        }}
      >
        궁금한 단어나 문장을 찾아보세요
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: spacing(3),
          width: '100%',
          maxWidth: pxToRem(500),
          backgroundColor: palette.background.paper,
          padding: `${spacing(3)} ${spacing(2)}`,
          borderRadius: pxToRem(16),
          boxShadow: shadows[4],
          marginTop: spacing(4),
        }}
      >
        <FormControl fullWidth>
          <Typography
            variant="body2"
            sx={{
              color: palette.text.secondary,
            }}
          >
            입력 언어
          </Typography>
          <Select
            value={queryLanguage}
            onChange={handleLanguageChange}
            sx={{
              backgroundColor: palette.background.paper,
              marginTop: spacing(1),
            }}
          >
            {[sourceLanguage, targetLanguage].map((language) => (
              <MenuItem key={language} value={language}>
                {getLanguageLabel(language)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <SearchInputField placeholder={`${getLanguageLabel(queryLanguage)} 단어 및 문장`} onClick={handleSearchClick} />
      </Box>
    </Box>
  );
}

export default ExploreView;

'use client';

import { SearchInputField } from '@/components/SearchInputField';
import { useQueryExploreSearch } from '@/features/explore/hooks';
import { useExploreStore } from '@/features/explore/stores';
import { useGetLanguageLabel, useSourceLanguage } from '@/language';
import { useTypedRouter } from '@/routes/routes';
import { ArrowBack } from '@mui/icons-material';
import { Box, IconButton, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useState } from 'react';

function ExploreSearchView() {
  const { palette, spacing } = useTheme();
  const router = useTypedRouter();

  const sourceLanguage = useSourceLanguage();
  const getLanguageLabel = useGetLanguageLabel();
  const queryLanguage = useExploreStore((store) => store.queryLanguage);

  const [query, setQuery] = useState('');

  const handleToExplore = () => router.push('/explore');

  const { isFetching: isSearching } = useQueryExploreSearch({ query, queryLanguage, sourceLanguage }, { enabled: Boolean(query) });

  const handleSearch = (value: string) => {
    // setQuery(value);
  };

  return (
    <Box
      component={motion.div}
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30,
      }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
        backgroundColor: palette.background.default,
        transform: 'translateX(100%)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing(1),
          padding: `${spacing(2)} ${spacing(1)}`,
          backgroundColor: palette.background.paper,
          borderBottom: `1px solid ${palette.divider}`,
        }}
      >
        <IconButton onClick={handleToExplore} sx={{ padding: spacing(1) }}>
          <ArrowBack sx={{ color: palette.text.primary }} />
        </IconButton>

        <Box sx={{ flex: 1 }}>
          <SearchInputField
            onSearch={handleSearch}
            placeholder={`${getLanguageLabel(queryLanguage)} 단어 및 문장`}
            autoFocus
            blurOnSearch
            disabled={isSearching}
          />
        </Box>
      </Box>

      {/* 검색 결과 영역 (추후 구현) */}
      <Box
        sx={{
          flex: 1,
          padding: spacing(2),
          overflowY: 'auto',
        }}
      >
        {/* 검색 결과가 여기에 표시될 예정 */}
      </Box>
    </Box>
  );
}

export default ExploreSearchView;

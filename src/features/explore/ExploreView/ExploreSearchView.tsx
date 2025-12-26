'use client';

import { SearchInputField } from '@/components/SearchInputField';
import { useExploreStore } from '@/features/explore/stores';
import { useGetLanguageLabel } from '@/language';
import { useTypedRouter } from '@/routes/routes';
import { ArrowBack } from '@mui/icons-material';
import { Box, IconButton, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { ChangeEvent } from 'react';

function ExploreSearchView() {
  const { palette, spacing } = useTheme();
  const router = useTypedRouter();
  const getLanguageLabel = useGetLanguageLabel();

  const queryLanguage = useExploreStore((store) => store.queryLanguage);
  const searchQuery = useExploreStore((store) => store.searchQuery);
  const setSearchQuery = useExploreStore((store) => store.setSearchQuery);

  const handleBackClick = () => {
    router.push('/explore');
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
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
        <IconButton onClick={handleBackClick} sx={{ padding: spacing(1) }}>
          <ArrowBack sx={{ color: palette.text.primary }} />
        </IconButton>

        <Box sx={{ flex: 1 }}>
          <SearchInputField
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={`${getLanguageLabel(queryLanguage)} 단어 및 문장`}
            autoFocus
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

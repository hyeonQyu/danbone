import { Loading } from '@/components/Loading';
import { ExploreSearchInputField } from '@/features/explore/components/ExploreSearchInputField';
import { Language } from '@/language';
import { useTypedRouter } from '@/routes/routes';
import { ArrowBack } from '@mui/icons-material';
import { Box, IconButton, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ExploreSearchViewTemplateProps {
  queryLanguage: Language;
  isSearching: boolean;
  query: string;
  onSearch: (value: string) => void;
  renderResults: () => ReactNode;
}

function ExploreSearchViewTemplate({ queryLanguage, isSearching, query, onSearch, renderResults }: ExploreSearchViewTemplateProps) {
  const { palette, spacing } = useTheme();
  const router = useTypedRouter();

  const handleToExplore = () => router.push('/explore');

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
          <ExploreSearchInputField queryLanguage={queryLanguage} onSearch={onSearch} autoFocus blurOnSearch disabled={isSearching} />
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          padding: spacing(2),
          overflowY: 'auto',
        }}
      >
        {isSearching ? <Loading messages={[`${query} 검색 중...`, '잠시만 기다려 주세요...', '처리 중입니다...']} /> : renderResults()}
      </Box>
    </Box>
  );
}

export default ExploreSearchViewTemplate;

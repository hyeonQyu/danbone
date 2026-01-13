import { BackButton } from '@/components/BackButton';
import { PageViewContainer } from '@/components/PageViewContainer';
import { SlideInContainer } from '@/components/SlideInContainer';
import { DictionaryJAEntryDetailView } from '@/features/dictionary/components/DictionaryEntryDetail';
import { useTargetLanguage } from '@/language';
import { useTypedRouter, useTypedSearchParams } from '@/routes';
import { Z_INDEX } from '@/styles/zIndex.constants';
import { Box, Typography, useTheme } from '@mui/material';

function ExploreDictionaryEntryDetailView() {
  const { spacing } = useTheme();

  const searchParams = useTypedSearchParams('/explore/search/detail');
  const { id } = searchParams;

  const targetLanguage = useTargetLanguage();

  const router = useTypedRouter();

  const handleBack = () => router.back();

  const renderContent = () => {
    if (targetLanguage === 'ja') {
      return <DictionaryJAEntryDetailView id={id} />;
    }

    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography variant="body1" color="text.secondary">
          지원하지 않는 언어입니다.
        </Typography>
      </Box>
    );
  };

  return (
    <SlideInContainer>
      <Box
        sx={{
          padding: `${spacing(2)} ${spacing(1)}`,
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: Z_INDEX.backward,
        }}
      >
        <BackButton onBack={handleBack} />
      </Box>

      <PageViewContainer>{renderContent()}</PageViewContainer>
    </SlideInContainer>
  );
}

export default ExploreDictionaryEntryDetailView;

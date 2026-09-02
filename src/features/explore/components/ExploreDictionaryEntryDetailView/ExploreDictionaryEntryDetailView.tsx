import { BackButton } from '@/components/BackButton';
import { PageViewContainer } from '@/components/PageViewContainer';
import { SlideInContainer } from '@/components/SlideInContainer';
import { DictionaryEntryByLanguage, DictionaryEntrySchemaByLanguage } from '@/features/dictionary';
import { DictionaryJAEntryDetail } from '@/features/dictionary/components/DictionaryEntryDetail';
import { normalizeToSchema } from '@/lib';
import { useTypedRouter, useTypedSearchParams } from '@/routes';
import { Z_INDEX } from '@/styles/zIndex.constants';
import { Box, useTheme } from '@mui/material';

function ExploreDictionaryEntryDetailView() {
  const { spacing } = useTheme();

  const searchParams = useTypedSearchParams('/explore/search/detail');
  const { language, ...rawEntry } = searchParams;
  const entry = normalizeToSchema(DictionaryEntrySchemaByLanguage[language], rawEntry);

  const router = useTypedRouter();

  const handleBack = () => router.back();

  const renderContent = () => {
    if (language === 'ja') {
      return <DictionaryJAEntryDetail entry={entry as DictionaryEntryByLanguage['ja']} />;
    }

    if (language === 'ko') {
      return <div>한국어 사전은 아직 지원하지 않습니다.</div>;
    }

    return <div>지원하지 않는 언어입니다.</div>;
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

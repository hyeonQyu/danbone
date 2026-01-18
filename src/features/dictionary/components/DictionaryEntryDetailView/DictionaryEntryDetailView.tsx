import { BackButton } from '@/components/BackButton';
import { PageViewContainer } from '@/components/PageViewContainer';
import { SlideInContainer } from '@/components/SlideInContainer';
import { DictionaryJAEntryDetailView } from '@/features/dictionary/components/DictionaryEntryDetail';
import AddEntryToVocabularyBookButton from '@/features/dictionary/components/DictionaryEntryDetailView/AddEntryToVocabularyBookButton';
import { useTargetLanguage } from '@/language';
import { useTypedRouter } from '@/routes';
import { Box, Typography, useTheme } from '@mui/material';

interface DictionaryEntryDetailViewProps {
  id: string;
  addableToVocabularyBook?: boolean;
}

function DictionaryEntryDetailView({ id, addableToVocabularyBook }: DictionaryEntryDetailViewProps) {
  const { spacing, palette } = useTheme();

  const targetLanguage = useTargetLanguage();

  const router = useTypedRouter();

  const handleBack = () => router.back();

  return (
    <SlideInContainer>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing(1),
          padding: `${spacing(2)} ${spacing(1)}`,
          backgroundColor: palette.background.paper,
          borderBottom: `1px solid ${palette.divider}`,
        }}
      >
        <BackButton onBack={handleBack} />
        {addableToVocabularyBook && <AddEntryToVocabularyBookButton entryId={id} />}
      </Box>

      <PageViewContainer
        sx={{
          overflowY: 'auto',
          display: 'block',
        }}
      >
        {(() => {
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
        })()}
      </PageViewContainer>
    </SlideInContainer>
  );
}

export default DictionaryEntryDetailView;

import { PageViewContainer } from '@/components/PageViewContainer';
import { SlideInContainer } from '@/components/SlideInContainer';
import { SlideInHeader } from '@/components/SlideInHeader';
import { VocabularyBookEntity } from '@/features/vocabulary/vocabulary.types';
import { Box, Typography, useTheme } from '@mui/material';
import { ReactNode } from 'react';

interface VocabularyEntryListViewTemplateProps {
  book: VocabularyBookEntity;
  onBack: () => void;
  renderEntries: () => ReactNode;
}

function VocabularyEntryListViewTemplate({ book, onBack, renderEntries }: VocabularyEntryListViewTemplateProps) {
  const { spacing } = useTheme();

  return (
    <SlideInContainer>
      <SlideInHeader onBack={onBack}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing(2),
            flex: 1,
          }}
        >
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              backgroundColor: book.color,
              flexShrink: 0,
            }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h5"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {book.name}
            </Typography>
          </Box>
        </Box>
      </SlideInHeader>

      <PageViewContainer
        sx={{
          overflowY: 'auto',
          display: 'block',
          p: 2,
        }}
      >
        {renderEntries()}
      </PageViewContainer>
    </SlideInContainer>
  );
}

export default VocabularyEntryListViewTemplate;

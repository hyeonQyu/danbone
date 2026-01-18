'use client';

import { useCreateVocabularyBook } from '@/features/vocabulary/hooks/useCreateVocabularyBook';
import { useQueryMyVocabularyBooks } from '@/features/vocabulary/hooks/useQueryMyVocabularyBooks';
import { getLanguageLabel, useTargetLanguage } from '@/language';
import { Add } from '@mui/icons-material';
import { Box, Button, Container, Typography } from '@mui/material';
import EmptyVocabularyBookList from './EmptyVocabularyBookList';
import VocabularyBookList from './VocabularyBookList';
import VocabularyBookListViewSkeleton from './VocabularyBookListViewSkeleton';

function VocabularyBookListView() {
  const targetLanguage = useTargetLanguage();

  const { data: books = [], isLoading } = useQueryMyVocabularyBooks();
  const createVocabularyBook = useCreateVocabularyBook();

  const handleCreateBook = () => createVocabularyBook();

  if (isLoading) {
    return <VocabularyBookListViewSkeleton />;
  }

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%', padding: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">{getLanguageLabel(targetLanguage)} 단어장</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreateBook}>
          새 단어장 만들기
        </Button>
      </Box>

      {books.length === 0 ? <EmptyVocabularyBookList onCreateBook={handleCreateBook} /> : <VocabularyBookList books={books} />}
    </Container>
  );
}

export default VocabularyBookListView;

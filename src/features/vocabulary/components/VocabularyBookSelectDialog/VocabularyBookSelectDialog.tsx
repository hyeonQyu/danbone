import { FullScreenDialogToolbar } from '@/components/FullScreenDialogToolbar';
import { SearchInputField } from '@/components/SearchInputField';
import { useVocabularyBooksFetchQueryOptions } from '@/features/vocabulary/hooks/useVocabularyBooksFetchQueryOptions';
import { VocabularyBookEntity } from '@/features/vocabulary/vocabulary.types';
import { Box, CircularProgress, Container, List, ListItemButton, ListItemText, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useDeferredValue, useMemo, useState } from 'react';

export type VocabularyBookSelectDialogResult = { book: VocabularyBookEntity };

interface VocabularyBookSelectDialogProps {
  onClose: (result?: VocabularyBookSelectDialogResult) => void;
}

function VocabularyBookSelectDialog({ onClose }: VocabularyBookSelectDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const vocabularyBooksQueryOptions = useVocabularyBooksFetchQueryOptions();
  const { data: books = [], isLoading: loading } = useQuery(vocabularyBooksQueryOptions);

  const filteredBooks = useMemo(
    () => books.filter((book) => book.name.toLowerCase().includes(deferredSearchQuery.toLowerCase())),
    [books, deferredSearchQuery],
  );

  const handleSelectBook = (book: VocabularyBookEntity) => {
    onClose({ book });
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <FullScreenDialogToolbar title="단어장 선택" onClose={() => onClose()} />

      <Container maxWidth="sm" sx={{ pt: 3, pb: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          단어를 추가할 단어장을 선택하세요
        </Typography>
        <SearchInputField
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="단어장 이름으로 검색"
          autoFocus
        />
      </Container>

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <Container maxWidth="sm">
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : filteredBooks.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              {searchQuery ? '검색 결과가 없습니다.' : '단어장이 없습니다.'}
            </Typography>
          ) : (
            <List
              sx={{
                py: 0,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                mb: 2,
                overflow: 'hidden',
              }}
            >
              {filteredBooks.map((book, index, array) => (
                <ListItemButton
                  key={`${book.id}-${index}`}
                  onClick={() => handleSelectBook(book)}
                  sx={{
                    borderBottom: index === array.length - 1 ? 'none' : '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      backgroundColor: book.color,
                      mr: 2,
                      flexShrink: 0,
                    }}
                  />
                  <ListItemText
                    primary={book.name}
                    secondary={`${book.entryIds.length}개의 단어`}
                    slotProps={{
                      primary: {
                        fontWeight: 500,
                      },
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          )}
        </Container>
      </Box>
    </Box>
  );
}

export default VocabularyBookSelectDialog;

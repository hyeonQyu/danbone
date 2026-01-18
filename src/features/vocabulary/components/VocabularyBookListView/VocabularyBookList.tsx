import { VocabularyBookEntity } from '@/features/vocabulary/vocabulary.types';
import { useTypedRouter } from '@/routes';
import { usePxToRem } from '@/styles';
import { Box, List, ListItemButton, Typography, useTheme } from '@mui/material';

interface VocabularyBookListProps {
  books: VocabularyBookEntity[];
}

function VocabularyBookList({ books }: VocabularyBookListProps) {
  const { spacing, palette, transitions } = useTheme();
  const pxToRem = usePxToRem();

  const router = useTypedRouter();

  const getHandleClick = (bookId: string) => () => {
    router.push('/vocabulary/book/[id]', { searchParams: { id: bookId } });
  };

  return (
    <List
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 0,
        overflow: 'auto',
      }}
    >
      {books.map((book) => (
        <ListItemButton
          key={book.id}
          onClick={getHandleClick(book.id)}
          sx={{
            p: spacing(2.5),
            borderRadius: spacing(1),
            border: `1px solid ${palette.divider}`,
            bgcolor: palette.background.default,
            cursor: 'pointer',
            userSelect: 'none',
            WebkitTapHighlightColor: 'transparent',
            transition: transitions.create(['transform', 'border-color', 'background-color'], {
              duration: transitions.duration.shorter,
            }),
            '@media (hover: hover)': {
              '&:hover': {
                transform: `translateY(-${pxToRem(2)})`,
              },
            },
            '@media (hover: none)': {},
            '&:active': {
              transform: `translateY(${pxToRem(1)})`,
              backgroundColor: palette.action.selected,
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: book.color,
                mr: 2,
                flexShrink: 0,
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
                {book.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {book.entryIds.length}개의 단어
              </Typography>
            </Box>
          </Box>
        </ListItemButton>
      ))}
    </List>
  );
}

export default VocabularyBookList;

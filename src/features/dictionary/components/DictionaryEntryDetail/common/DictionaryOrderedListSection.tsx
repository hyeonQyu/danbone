import { Box, Typography, useTheme } from '@mui/material';

interface DictionaryOrderedListSectionProps {
  title: string;
  items: string[];
}

function DictionaryOrderedListSection({ title, items }: DictionaryOrderedListSectionProps) {
  const { spacing, palette } = useTheme();

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          mb: spacing(3),
          fontWeight: 700,
          fontSize: { xs: '1.5rem', md: '1.75rem' },
        }}
      >
        {title}
      </Typography>
      <Box
        component="ol"
        sx={{
          pl: spacing(4),
          m: 0,
          '& li': {
            mb: spacing(1),
            '&::marker': {
              color: palette.primary.main,
              fontWeight: 700,
            },
          },
        }}
      >
        {items.map((item, index) => (
          <Typography
            key={index}
            component="li"
            variant="body1"
            sx={{
              fontSize: { xs: '1.1rem', md: '1.2rem' },
              lineHeight: 1.8,
            }}
          >
            {item}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}

export default DictionaryOrderedListSection;

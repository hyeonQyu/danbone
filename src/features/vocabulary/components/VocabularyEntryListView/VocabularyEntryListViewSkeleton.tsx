import { Box, Skeleton } from '@mui/material';

function VocabularyEntryListViewSkeleton() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 2,
      }}
    >
      {[1, 2, 3, 4, 5].map((index) => (
        <Box
          key={index}
          sx={{
            p: 2,
            borderRadius: 1,
            backgroundColor: 'background.default',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box
            sx={{
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Skeleton variant="text" width="40%" height={28} />
            <Skeleton variant="text" width="30%" height={24} />
            <Skeleton variant="rectangular" width={60} height={24} sx={{ ml: 'auto', borderRadius: 2 }} />
          </Box>
          <Box>
            <Skeleton variant="text" width="90%" height={20} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width="70%" height={20} />
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default VocabularyEntryListViewSkeleton;

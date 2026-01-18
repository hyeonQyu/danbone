import { Box, Card, Container, Skeleton } from '@mui/material';

function VocabularyBookListViewSkeleton() {
  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%', padding: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Skeleton variant="text" width={120} height={40} />
        <Skeleton variant="rectangular" width={140} height={36} sx={{ borderRadius: 1 }} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {[1, 2, 3].map((index) => (
          <Card key={index} elevation={1}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2.5,
              }}
            >
              <Skeleton variant="circular" width={32} height={32} sx={{ mr: 2, flexShrink: 0 }} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={28} sx={{ mb: 0.5 }} />
                <Skeleton variant="text" width="40%" height={20} />
              </Box>
            </Box>
          </Card>
        ))}
      </Box>
    </Container>
  );
}

export default VocabularyBookListViewSkeleton;

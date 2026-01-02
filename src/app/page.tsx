'use client';

import { Loading } from '@/components/Loading';
import { Box } from '@mui/material';

export default function Home() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Loading />
    </Box>
  );
}

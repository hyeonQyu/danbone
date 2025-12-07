'use client';

import { Box, SxProps, Theme, useTheme } from '@mui/material';
import { ReactNode } from 'react';

interface PageViewContainerProps {
  children: ReactNode;
  sx?: SxProps<Theme>;
}

function PageViewContainer({ children, sx }: PageViewContainerProps) {
  const { palette, spacing } = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: palette.background.default,
        padding: spacing(3),
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

export default PageViewContainer;

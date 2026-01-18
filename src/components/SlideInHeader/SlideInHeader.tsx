'use client';

import { BackButton } from '@/components/BackButton';
import { Box, useTheme } from '@mui/material';
import { ReactNode } from 'react';

interface SlideInHeaderProps {
  onBack: () => void;
  children?: ReactNode;
}

function SlideInHeader({ onBack, children }: SlideInHeaderProps) {
  const { spacing, palette } = useTheme();

  return (
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
      <BackButton onBack={onBack} />
      {children}
    </Box>
  );
}

export default SlideInHeader;

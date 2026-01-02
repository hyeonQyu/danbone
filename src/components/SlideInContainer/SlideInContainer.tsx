'use client';

import { Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SlideInContainerProps {
  children: ReactNode;
}

function SlideInContainer({ children }: SlideInContainerProps) {
  const { palette } = useTheme();

  return (
    <Box
      component={motion.div}
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
      }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
        backgroundColor: palette.background.default,
        transform: 'translateX(100%)',
      }}
    >
      {children}
    </Box>
  );
}

export default SlideInContainer;

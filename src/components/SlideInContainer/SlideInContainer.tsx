'use client';

import { BOTTOM_NAVIGATION_HEIGHT } from '@/components/NavigationLayout';
import { useBottomNavigation } from '@/routes';
import { usePxToRem } from '@/styles';
import { Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SlideInContainerProps {
  children: ReactNode;
}

function SlideInContainer({ children }: SlideInContainerProps) {
  const { palette } = useTheme();
  const pxToRem = usePxToRem();

  const { currentNavigationIndex } = useBottomNavigation();
  const hasBottomNavigation = currentNavigationIndex >= 0;
  const bottomNavigationHeight = pxToRem(hasBottomNavigation ? BOTTOM_NAVIGATION_HEIGHT : 0);

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
        maxHeight: `calc(100vh - ${bottomNavigationHeight})`,
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

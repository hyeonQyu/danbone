import { BOTTOM_NAVIGATION_HEIGHT } from '@/components/NavigationLayout';
import { useBottomNavigation } from '@/routes';
import { usePxToRem } from '@/styles';
import { Box, SxProps, Theme, useTheme } from '@mui/material';
import { ReactNode } from 'react';

interface PageViewContainerProps {
  children: ReactNode;
  sx?: SxProps<Theme>;
}

function PageViewContainer({ children, sx }: PageViewContainerProps) {
  const { palette, spacing } = useTheme();
  const pxToRem = usePxToRem();

  const { currentNavigationIndex } = useBottomNavigation();
  const hasBottomNavigation = currentNavigationIndex >= 0;
  const bottomNavigationHeight = pxToRem(hasBottomNavigation ? BOTTOM_NAVIGATION_HEIGHT : 0);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: `calc(100% - ${bottomNavigationHeight})`,
        height: `calc(100vh - ${bottomNavigationHeight})`,
        backgroundColor: palette.background.default,
        padding: spacing(3),
        overflow: 'auto',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

export default PageViewContainer;

import { PageViewContainer } from '@/components/PageViewContainer';
import { usePxToRem } from '@/styles';
import { ReactNode } from 'react';
import BottomNavigation, { BOTTOM_NAVIGATION_HEIGHT } from './BottomNavigation';

function NavigationLayout({ children }: { children: ReactNode }) {
  const pxToRem = usePxToRem();

  return (
    <>
      <PageViewContainer
        sx={{
          minHeight: `calc(100vh - ${pxToRem(BOTTOM_NAVIGATION_HEIGHT)})`,
          height: `calc(100vh - ${pxToRem(BOTTOM_NAVIGATION_HEIGHT)})`,
        }}
      >
        {children}
      </PageViewContainer>
      <BottomNavigation />
    </>
  );
}

export default NavigationLayout;

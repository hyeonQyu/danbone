import { Stack, useTheme } from '@mui/material';
import { ReactNode } from 'react';

interface ExploreSearchResultsContainerProps {
  children: ReactNode;
}

function ExploreSearchResultsContainer({ children }: ExploreSearchResultsContainerProps) {
  const { spacing } = useTheme();

  return <Stack sx={{ gap: spacing(2) }}>{children}</Stack>;
}

export default ExploreSearchResultsContainer;

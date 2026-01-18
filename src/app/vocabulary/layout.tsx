'use client';

import { NavigationLayout } from '@/components/NavigationLayout';
import { ReactNode } from 'react';

function VocabularyLayout({ children }: { children: ReactNode }) {
  return <NavigationLayout>{children}</NavigationLayout>;
}

export default VocabularyLayout;

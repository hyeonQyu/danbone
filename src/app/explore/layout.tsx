'use client';

import { NavigationLayout } from '@/components/NavigationLayout';
import { ReactNode } from 'react';

export default function ExploreLayout({ children }: { children: ReactNode }) {
  return <NavigationLayout>{children}</NavigationLayout>;
}

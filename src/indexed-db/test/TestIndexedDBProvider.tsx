'use client';

import { ReactNode } from 'react';
import IndexedDBProvider from '../IndexedDBProvider';
import { TEST_DB_CONFIG } from './test.utils';

/**
 * 테스트용 IndexedDB Provider
 */
export function TestIndexedDBProvider({ children }: { children: ReactNode }) {
  return <IndexedDBProvider config={TEST_DB_CONFIG}>{children}</IndexedDBProvider>;
}

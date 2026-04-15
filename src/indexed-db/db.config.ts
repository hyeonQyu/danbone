import { LanguageSchema } from '@/language';
import { z } from 'zod';
import type { StoreConfig } from './types';

export const createIndexedDBConfig = <const T extends readonly StoreConfig[]>(config: { name: string; version: number; stores: T }) =>
  config;

export const INDEXED_DB_CONFIG = createIndexedDBConfig({
  name: 'danbone DB',
  version: 5,
  stores: [
    {
      name: 'explore',
      schema: z.object({
        id: LanguageSchema,
        queryLanguage: LanguageSchema,
      }),
      keyPath: 'id',
    },
  ] as const,
});

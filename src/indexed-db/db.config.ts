import { z } from 'zod';
import type { StoreConfig } from './types';

export const createIndexedDBConfig = <const T extends readonly StoreConfig[]>(config: { name: string; version: number; stores: T }) =>
  config;

const defaultSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  timestamp: z.number().optional(),
});

export const INDEXED_DB_CONFIG = createIndexedDBConfig({
  name: 'danbone DB',
  version: 1,
  stores: [
    {
      name: 'default',
      schema: defaultSchema,
      keyPath: 'id',
      autoIncrement: true,
      indexes: [
        {
          name: 'timestamp',
          keyPath: 'timestamp',
          options: { unique: false },
        },
      ],
    },
  ] as const,
});

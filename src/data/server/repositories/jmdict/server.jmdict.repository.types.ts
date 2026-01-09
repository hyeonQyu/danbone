import { JmdictEntity } from '@/features/dictionary';

export interface JmdictServerRepository {
  getStoredCount: () => Promise<number>;

  saveEntries: (entries: JmdictEntity[]) => Promise<{
    savedEntries: number;
    savedIndexes: number;
  }>;
}

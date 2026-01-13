import { JmdictEntity } from '@/features/dictionary';
import { WriteBatch } from 'firebase-admin/firestore';

export interface JmdictEntriesRepository {
  getStoredCount(): Promise<number>;
  addEntriesToBatch(batch: WriteBatch, entries: JmdictEntity[]): number;
  updateEntriesToBatch(batch: WriteBatch, entries: Omit<JmdictEntity, 'createdAt'>[]): number;
  findById(id: string): Promise<JmdictEntity | null>;
  findByIds(ids: string[]): Promise<JmdictEntity[]>;
  getAllEntriesPaginated(
    batchSize: number,
    startAfterId?: string,
  ): Promise<{ entries: JmdictEntity[]; lastId: string | null; hasMore: boolean }>;
}

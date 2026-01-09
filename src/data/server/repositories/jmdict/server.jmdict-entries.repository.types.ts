import { JmdictEntity } from '@/features/dictionary';
import { WriteBatch } from 'firebase-admin/firestore';

export interface JmdictEntriesRepository {
  getStoredCount(): Promise<number>;
  addEntriesToBatch(batch: WriteBatch, entries: JmdictEntity[]): number;
}

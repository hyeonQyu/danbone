import { JmdictEntity } from '@/features/dictionary';
import { WriteBatch } from 'firebase-admin/firestore';

export interface JmdictSearchIndexesRepository {
  addIndexesToBatch(batch: WriteBatch, entries: JmdictEntity[]): number;
}

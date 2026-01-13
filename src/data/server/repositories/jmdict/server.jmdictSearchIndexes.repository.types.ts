import { JmdictEntity, JmdictSearchIndexEntity, JmdictTermType } from '@/features/dictionary';
import { WriteBatch } from 'firebase-admin/firestore';

export interface JmdictSearchIndexesRepository {
  addIndexesToBatch(batch: WriteBatch, entries: JmdictEntity[]): number;
  findBySearchTerm(searchTerm: string, termType: JmdictTermType): Promise<JmdictSearchIndexEntity[]>;
}

import { JmdictEntriesRepository } from '@/data/server/repositories/jmdict/server.jmdictEntries.repository.types';
import { getFirebaseServerRepositoryCreator, serializeEntity } from '@/data/server/repositories/server.repository.utils';
import { JmdictEntity } from '@/features/dictionary';
import { WriteBatch } from 'firebase-admin/firestore';

export const jmdictEntriesRepository = getFirebaseServerRepositoryCreator('jmdict-entries')<JmdictEntriesRepository>(({
  db,
  collectionName,
}) => {
  const getStoredCount = async (): Promise<number> => {
    const snapshot = await db.collection(collectionName).count().get();
    return snapshot.data().count;
  };

  const addEntriesToBatch = (batch: WriteBatch, entries: JmdictEntity[]): number => {
    entries.forEach((entry) => {
      const entryDoc = db.collection(collectionName).doc(entry.id);
      batch.set(entryDoc, entry);
    });

    return entries.length;
  };

  const updateEntriesToBatch = (batch: WriteBatch, entries: Omit<JmdictEntity, 'createdAt'>[]): number => {
    entries.forEach((entry) => {
      const entryDoc = db.collection(collectionName).doc(entry.id);
      batch.update(entryDoc, entry as Partial<JmdictEntity>);
    });

    return entries.length;
  };

  const findById = async (id: string): Promise<JmdictEntity | null> => {
    const docSnap = await db.collection(collectionName).doc(id).get();
    if (!docSnap.exists) {
      return null;
    }

    return serializeEntity<JmdictEntity>(docSnap.data()!);
  };

  const findByIds = async (ids: string[]): Promise<JmdictEntity[]> => {
    if (ids.length === 0) {
      return [];
    }

    const docRefs = ids.map((id) => db.collection(collectionName).doc(id));
    const docSnaps = await db.getAll(...docRefs);

    return docSnaps.filter((snap) => snap.exists).map((snap) => serializeEntity<JmdictEntity>(snap.data()!));
  };

  const getAllEntriesPaginated = async (
    batchSize: number,
    startAfterId?: string,
  ): Promise<{ entries: JmdictEntity[]; lastId: string | null; hasMore: boolean }> => {
    let query = db.collection(collectionName).orderBy('id').limit(batchSize);

    if (startAfterId) {
      query = query.startAfter(startAfterId);
    }

    const snapshot = await query.get();
    const entries = snapshot.docs.map((doc) => serializeEntity<JmdictEntity>(doc.data()!));
    const lastId = entries.length > 0 ? entries[entries.length - 1].id : null;
    const hasMore = snapshot.docs.length === batchSize;

    return { entries, lastId, hasMore };
  };

  return {
    getStoredCount,
    addEntriesToBatch,
    updateEntriesToBatch,
    findById,
    findByIds,
    getAllEntriesPaginated,
  };
});

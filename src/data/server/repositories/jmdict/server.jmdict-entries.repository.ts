import { JmdictEntriesRepository } from '@/data/server/repositories/jmdict/server.jmdict-entries.repository.types';
import { getFirebaseServerRepositoryCreator } from '@/data/server/repositories/server.repository.utils';
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

  return {
    getStoredCount,
    addEntriesToBatch,
  };
});

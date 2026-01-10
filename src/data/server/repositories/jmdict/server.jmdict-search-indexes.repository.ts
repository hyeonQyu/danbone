import { JmdictSearchIndexesRepository } from '@/data/server/repositories/jmdict/server.jmdict-search-indexes.repository.types';
import { getFirebaseServerRepositoryCreator } from '@/data/server/repositories/server.repository.utils';
import { JmdictEntity, JmdictSearchIndexEntity, JmdictTermType } from '@/features/dictionary';
import { WriteBatch } from 'firebase-admin/firestore';

export const jmdictSearchIndexesRepository = getFirebaseServerRepositoryCreator('jmdict-search-indexes')<JmdictSearchIndexesRepository>(({
  db,
  collectionName,
}) => {
  const createKanjiIndexes = (entry: JmdictEntity): JmdictSearchIndexEntity[] => {
    return entry.kanji.map((kanji) => ({
      entryId: entry.id,
      searchTerm: kanji.text,
      termType: 'kanji' as const,
      common: kanji.common,
    }));
  };

  const createKanaIndexes = (entry: JmdictEntity): JmdictSearchIndexEntity[] => {
    return entry.kana.map((kana) => ({
      entryId: entry.id,
      searchTerm: kana.text,
      termType: 'kana' as const,
      common: kana.common,
    }));
  };

  const addIndexesToBatch = (batch: WriteBatch, entries: JmdictEntity[]): number => {
    return entries.reduce((operationCount, entry) => {
      const allIndexes = [...createKanjiIndexes(entry), ...createKanaIndexes(entry)];

      allIndexes.forEach((indexData) => {
        const indexDoc = db.collection(collectionName).doc();
        batch.set(indexDoc, indexData);
      });

      return operationCount + allIndexes.length;
    }, 0);
  };

  const findBySearchTerm = async (searchTerm: string, termType: JmdictTermType): Promise<JmdictSearchIndexEntity[]> => {
    const snapshot = await db
      .collection(collectionName)
      .where('searchTerm', '==', searchTerm)
      .where('termType', '==', termType)
      .orderBy('common', 'desc')
      .get();

    return snapshot.docs.map((doc) => doc.data()! as JmdictSearchIndexEntity);
  };

  return {
    addIndexesToBatch,
    findBySearchTerm,
  };
});

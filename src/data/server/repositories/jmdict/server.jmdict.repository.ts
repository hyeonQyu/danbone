import { JmdictServerRepository } from '@/data/server/repositories/jmdict/server.jmdict.repository.types';
import { getFirebaseServerRepositoryCreator } from '@/data/server/repositories/server.repository.utils';
import { JmdictSearchIndexEntity } from '@/features/dictionary';

export const jmdictServerRepository = getFirebaseServerRepositoryCreator('jmdict')<JmdictServerRepository>(({ db, collectionName }) => {
  return {
    // 현재 저장된 개수 조회
    getStoredCount: async () => {
      const snapshot = await db.collection(collectionName).count().get();
      return snapshot.data().count;
    },

    // Entries 저장 (원본 + 인덱스)
    saveEntries: async (entries) => {
      let savedEntries = 0;
      let savedIndexes = 0;
      let batch = db.batch();
      let operationCount = 0;
      const MAX_BATCH_SIZE = 500;

      for (const entry of entries) {
        // 1. 원본 저장
        const entryDoc = db.collection(collectionName).doc(entry.id);
        batch.set(entryDoc, entry);
        operationCount++;
        savedEntries++;

        // 2. 검색 인덱스 생성 - 한자 표기
        for (const kanji of entry.kanji) {
          const indexDoc = db.collection('jmdict_search_index').doc();
          const indexData: JmdictSearchIndexEntity = {
            entryId: entry.id,
            searchTerm: kanji.text,
            termType: 'kanji',
            common: kanji.common,
          };
          batch.set(indexDoc, indexData);
          operationCount++;
          savedIndexes++;

          // Batch 크기 확인 (500 operations 제한)
          if (operationCount >= MAX_BATCH_SIZE) {
            await batch.commit();
            batch = db.batch();
            operationCount = 0;
          }
        }

        // 3. 검색 인덱스 생성 - 가나 표기
        for (const kana of entry.kana) {
          const indexDoc = db.collection('jmdict_search_index').doc();
          const indexData: JmdictSearchIndexEntity = {
            entryId: entry.id,
            searchTerm: kana.text,
            termType: 'kana',
            common: kana.common,
          };
          batch.set(indexDoc, indexData);
          operationCount++;
          savedIndexes++;

          // Batch 크기 확인
          if (operationCount >= MAX_BATCH_SIZE) {
            await batch.commit();
            batch = db.batch();
            operationCount = 0;
          }
        }
      }

      // 남은 batch commit
      if (operationCount > 0) {
        await batch.commit();
      }

      return {
        savedEntries,
        savedIndexes,
      };
    },
  };
});

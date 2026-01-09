import { firebaseAdmin, FIRESTORE_LIMITS } from '@/data/server/firebaseAdmin.config';
import { JmdictServerService, JmdictServerServiceDependencies } from '@/data/server/services/jmdict/server.jmdict.service.types';
import { getServerServiceCreator } from '@/data/server/services/server.service.utils';
import { JmdictEntity } from '@/features/dictionary/jmdict.entity';
import { JmdictEntry, JmdictEntrySchema } from '@/features/dictionary/jmdict.types';
import { devLog } from '@/lib';
import { Timestamp } from 'firebase-admin/firestore';

export const createJmdictServerService = getServerServiceCreator<JmdictServerService, JmdictServerServiceDependencies>(
  ({ jmdictEntriesRepository, jmdictSearchIndexesRepository }) => {
    const processEntitiesWithBatchCommit = async (entities: JmdictEntity[]) => {
      let savedEntries = 0;
      let savedIndexes = 0;
      let batch = firebaseAdmin.db.batch();
      let operationCount = 0;

      const commitCurrentBatch = async () => {
        if (operationCount > 0) {
          await batch.commit();
          batch = firebaseAdmin.db.batch();
          operationCount = 0;
        }
      };

      for (const entity of entities) {
        const entryOperations = jmdictEntriesRepository.addEntriesToBatch(batch, [entity]);
        const indexOperations = jmdictSearchIndexesRepository.addIndexesToBatch(batch, [entity]);

        operationCount += entryOperations + indexOperations;
        savedEntries += entryOperations;
        savedIndexes += indexOperations;

        if (operationCount >= FIRESTORE_LIMITS.batchOperation) {
          await commitCurrentBatch();
        }
      }

      await commitCurrentBatch();

      return { savedEntries, savedIndexes };
    };

    const saveNextBatch = async (allEntries: JmdictEntry[], batchSize: number) => {
      const startTime = Date.now();

      const checkCompletedAllEntries = (storedCount: number): boolean => {
        return storedCount >= allEntries.length;
      };

      const extractNextBatch = (storedCount: number): JmdictEntry[] => {
        return allEntries.slice(storedCount, storedCount + batchSize);
      };

      const validateAndConvertBatch = (batch: JmdictEntry[]): JmdictEntity[] => {
        const validatedBatch = batch.map((entry) => JmdictEntrySchema.parse(entry));
        const now = Timestamp.now().toDate();

        return validatedBatch.map((entry) => ({
          ...entry,
          createdAt: now,
          updatedAt: now,
        }));
      };

      const buildResult = (savedEntries: number, savedIndexes: number, storedCount: number) => {
        const totalStored = storedCount + savedEntries;
        const isComplete = totalStored >= allEntries.length;
        const duration = Date.now() - startTime;

        devLog(`✅ JMdict 저장 완료: ${savedEntries} entries, ${savedIndexes} indexes (${duration}ms)`);
        devLog(`📊 진행률: ${totalStored} / ${allEntries.length} (${Math.round((totalStored / allEntries.length) * 100)}%)`);

        return {
          savedEntries,
          savedIndexes,
          totalStored,
          isComplete,
          duration,
        };
      };

      const storedCount = await jmdictEntriesRepository.getStoredCount();

      if (checkCompletedAllEntries(storedCount)) {
        return buildResult(0, 0, storedCount);
      }

      const nextBatch = extractNextBatch(storedCount);
      const entities = validateAndConvertBatch(nextBatch);
      const { savedEntries, savedIndexes } = await processEntitiesWithBatchCommit(entities);

      return buildResult(savedEntries, savedIndexes, storedCount);
    };

    return {
      saveNextBatch,
    };
  },
);

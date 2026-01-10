import { firebaseAdmin, FIRESTORE_LIMITS } from '@/data/server/firebaseAdmin.config';
import { JmdictServerService, JmdictServerServiceDependencies } from '@/data/server/services/jmdict/server.jmdict.service.types';
import { getServerServiceCreator } from '@/data/server/services/server.service.utils';
import { JmdictEntity } from '@/features/dictionary/jmdict.entity';
import { JmdictEntry, JmdictEntrySchema } from '@/features/dictionary/jmdict.types';
import { devLog, TIME_UNIT } from '@/lib';
import { withTimeout } from 'es-toolkit';
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

    const flattenNestedArrays = <T>(value: T[]): T[] => {
      return value.map((item) => {
        if (Array.isArray(item)) {
          return item.join(',') as T;
        }
        return item;
      });
    };

    const validateAndConvertBatch = (batch: JmdictEntry[]): JmdictEntity[] => {
      const validatedBatch = batch.map((entry) => JmdictEntrySchema.parse(entry));
      const now = Timestamp.now().toDate();

      return validatedBatch.map((entry) => ({
        ...entry,
        sense: entry.sense.map((s) => ({
          ...s,
          related: flattenNestedArrays(s.related),
          antonym: flattenNestedArrays(s.antonym),
          languageSource: flattenNestedArrays(s.languageSource),
        })),
        createdAt: now,
        updatedAt: now,
      }));
    };

    return {
      saveEntries: async (batch: JmdictEntry[]) =>
        withTimeout(async () => {
          const startTime = Date.now();

          const entities = validateAndConvertBatch(batch);
          const { savedEntries, savedIndexes } = await processEntitiesWithBatchCommit(entities);
          const duration = Date.now() - startTime;
          devLog(`✅ JMdict 저장 완료: ${savedEntries} entries, ${savedIndexes} indexes (${duration}ms)`);

          return {
            savedEntries,
            savedIndexes,
            duration,
          };
        }, TIME_UNIT.unitOfMs.asSecond * 10),

      getStoredCount: () => {
        return jmdictEntriesRepository.getStoredCount();
      },
    };
  },
);

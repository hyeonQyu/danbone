import { firebaseAdmin, FIRESTORE_LIMITS } from '@/data/server/firebaseAdmin.config';
import { JmdictServerService, JmdictServerServiceDependencies } from '@/data/server/services/jmdict/server.jmdict.service.types';
import { getServerServiceCreator } from '@/data/server/services/server.service.utils';
import { JmdictEntity } from '@/features/dictionary/jmdict.entity';
import { JmdictEntry, JmdictEntrySchema } from '@/features/dictionary/jmdict.types';
import { devLog, TIME_UNIT, toUniqueArray } from '@/lib';
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

    const processEntitiesWithBatchUpdate = async (entities: Omit<JmdictEntity, 'createdAt'>[]) => {
      let updatedEntries = 0;
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
        const entryOperations = jmdictEntriesRepository.updateEntriesToBatch(batch, [entity]);

        operationCount += entryOperations;
        updatedEntries += entryOperations;

        if (operationCount >= FIRESTORE_LIMITS.batchOperation) {
          await commitCurrentBatch();
        }
      }

      await commitCurrentBatch();

      return { updatedEntries };
    };

    const flattenNestedArrays = <T>(value: T[]): T[] => {
      return value.map((item) => {
        if (Array.isArray(item)) {
          return item.join(',') as T;
        }
        return item;
      });
    };

    const validateAndProcessEntry = (entry: JmdictEntry) => {
      const validatedEntry = JmdictEntrySchema.parse(entry);

      return {
        ...validatedEntry,
        sense: validatedEntry.sense.map((s) => ({
          ...s,
          related: flattenNestedArrays(s.related),
          antonym: flattenNestedArrays(s.antonym),
          languageSource: flattenNestedArrays(s.languageSource),
        })),
      };
    };

    const validateAndConvertBatch = (batch: JmdictEntry[]): JmdictEntity[] => {
      const now = Timestamp.now().toDate();

      return batch.map((entry) => ({
        ...validateAndProcessEntry(entry),
        createdAt: now,
        updatedAt: now,
      }));
    };

    const validateAndConvertBatchForUpdate = (batch: JmdictEntry[]): Omit<JmdictEntity, 'createdAt'>[] => {
      const now = Timestamp.now().toDate();

      return batch.map((entry) => ({
        ...validateAndProcessEntry(entry),
        updatedAt: now,
      }));
    };

    const sortEntriesByCommon = (a: JmdictEntity, b: JmdictEntity) => {
      const hasCommon = (entity: JmdictEntity) => entity.kanji.some((k) => k.common) || entity.kana.some((k) => k.common);

      const aHasCommon = hasCommon(a);
      const bHasCommon = hasCommon(b);

      if (aHasCommon && !bHasCommon) return -1;
      if (!aHasCommon && bHasCommon) return 1;
      return 0;
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
          };
        }, TIME_UNIT.unitOfMs.asSecond * 10),

      updateEntries: async (batch: JmdictEntry[]) =>
        withTimeout(async () => {
          const startTime = Date.now();

          const entities = validateAndConvertBatchForUpdate(batch);
          const { updatedEntries } = await processEntitiesWithBatchUpdate(entities);
          const duration = Date.now() - startTime;
          devLog(`✅ JMdict 업데이트 완료: ${updatedEntries} entries (${duration}ms)`);

          return {
            updatedEntries,
          };
        }, TIME_UNIT.unitOfMs.asSecond * 10),

      getStoredCount: () => {
        return jmdictEntriesRepository.getStoredCount();
      },

      findById: async (id: string) => {
        return jmdictEntriesRepository.findById(id);
      },

      findByTerm: async ({ searchTerm, termType }) => {
        const indexes = await jmdictSearchIndexesRepository.findBySearchTerm(searchTerm, termType);

        if (indexes.length === 0) {
          return [];
        }

        const uniqueEntryIds = toUniqueArray(indexes, ({ entryId }) => entryId);
        const entries = await jmdictEntriesRepository.findByIds(uniqueEntryIds);
        return entries.sort(sortEntriesByCommon);
      },
    };
  },
);

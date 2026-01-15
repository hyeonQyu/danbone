import { getFirebaseServerRepositoryCreator, serializeEntity } from '@/data/server/repositories/server.repository.utils';
import type { VocabularyLearningRepository } from '@/data/server/repositories/vocabulary/server.vocabularyLearnings.repository.types';
import type { LearningEntryParams, VocabularyLearningEntity } from '@/features/vocabulary';
import { Timestamp } from 'firebase-admin/firestore';

export const vocabularyLearningRepository = getFirebaseServerRepositoryCreator('vocabulary-learnings')<VocabularyLearningRepository>(({
  db,
  collectionName,
}) => {
  const createLearningDocId = ({ userId, targetLanguage, entryId }: LearningEntryParams): string => {
    return `${userId}_${targetLanguage}_${entryId}`;
  };

  const collectionRef = db.collection(collectionName);

  return {
    create: async ({ userId, targetLanguage, entryId }) => {
      const now = Timestamp.now().toDate();
      const docId = createLearningDocId({ userId, targetLanguage, entryId });

      const entity: VocabularyLearningEntity = {
        id: docId,
        userId,
        targetLanguage,
        entryId,
        masteryLevel: 0,
        reviewCount: 0,
        correctCount: 0,
        lastReviewedAt: null,
        createdAt: now,
        updatedAt: now,
      };

      await collectionRef.doc(docId).set(entity);

      return entity;
    },

    findByEntry: async ({ userId, targetLanguage, entryId }) => {
      const docId = createLearningDocId({ userId, targetLanguage, entryId });
      const docSnap = await collectionRef.doc(docId).get();

      if (!docSnap.exists || !docSnap.data()) {
        return null;
      }

      return serializeEntity<VocabularyLearningEntity>(docSnap.data()!);
    },

    findByEntries: async ({ userId, targetLanguage, entryIds }) => {
      if (entryIds.length === 0) {
        return [];
      }

      const docIds = entryIds.map((entryId) => createLearningDocId({ userId, targetLanguage, entryId }));
      const docRefs = docIds.map((docId) => collectionRef.doc(docId));
      const docSnaps = await db.getAll(...docRefs);

      return docSnaps.filter((snap) => snap.exists).map((snap) => serializeEntity<VocabularyLearningEntity>(snap.data()!));
    },

    update: async ({ userId, targetLanguage, entryId, updates }) => {
      const docId = createLearningDocId({ userId, targetLanguage, entryId });
      const now = Timestamp.now().toDate();

      await collectionRef.doc(docId).update({
        ...updates,
        updatedAt: now,
      });
    },

    delete: async ({ userId, targetLanguage, entryId }) => {
      const docId = createLearningDocId({ userId, targetLanguage, entryId });
      await collectionRef.doc(docId).delete();
    },
  };
});

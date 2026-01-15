import { getFirebaseServerRepositoryCreator, serializeEntity } from '@/data/server/repositories/server.repository.utils';
import { VocabularyBooksRepository } from '@/data/server/repositories/vocabulary/server.vocabularyBooks.repository.types';
import { DuplicateError, NotFoundError } from '@/errors';
import { VocabularyBookEntity } from '@/features/vocabulary';
import { Timestamp } from 'firebase-admin/firestore';

export const vocabularyBooksRepository = getFirebaseServerRepositoryCreator('vocabulary-books')<VocabularyBooksRepository>(({
  db,
  collectionName,
}) => {
  const collectionRef = db.collection(collectionName);

  return {
    create: async ({ userId, name, targetLanguage }) => {
      const now = Timestamp.now().toDate();

      const entity: VocabularyBookEntity = {
        id: '',
        userId,
        targetLanguage,
        name,
        entryIds: [],
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await collectionRef.add(entity);
      entity.id = docRef.id;
      await docRef.update({ id: docRef.id });

      return entity;
    },

    findById: async (bookId) => {
      const docSnap = await collectionRef.doc(bookId).get();

      if (!docSnap.exists || !docSnap.data()) {
        return null;
      }

      return serializeEntity<VocabularyBookEntity>(docSnap.data()!);
    },

    findByUserId: async (userId, targetLanguage) => {
      let query = collectionRef.where('userId', '==', userId);

      if (targetLanguage) {
        query = query.where('targetLanguage', '==', targetLanguage) as FirebaseFirestore.Query<FirebaseFirestore.DocumentData>;
      }

      const querySnap = await query.orderBy('createdAt', 'desc').get();

      return querySnap.docs.map((doc) => serializeEntity<VocabularyBookEntity>(doc.data()));
    },

    update: async (bookId, updates) => {
      const now = Timestamp.now().toDate();

      await collectionRef.doc(bookId).update({
        ...updates,
        updatedAt: now,
      });
    },

    delete: async (bookId) => {
      await collectionRef.doc(bookId).delete();
    },

    addEntry: async (bookId, entryId) => {
      await db.runTransaction(async (transaction) => {
        const docRef = collectionRef.doc(bookId);
        const docSnap = await transaction.get(docRef);

        if (!docSnap.exists) {
          throw new NotFoundError('단어장을 찾을 수 없습니다');
        }

        const data = docSnap.data()!;
        const currentEntryIds = (data.entryIds || []) as string[];

        if (currentEntryIds.includes(entryId)) {
          throw new DuplicateError('이미 단어장에 추가된 항목입니다');
        }

        const updatedEntryIds = [...currentEntryIds, entryId];
        const now = Timestamp.now().toDate();

        transaction.update(docRef, {
          entryIds: updatedEntryIds,
          updatedAt: now,
        });
      });
    },

    deleteEntry: async (bookId: string, entryId: string) => {
      await db.runTransaction(async (transaction) => {
        const docRef = collectionRef.doc(bookId);
        const docSnap = await transaction.get(docRef);

        if (!docSnap.exists) {
          throw new NotFoundError('단어장을 찾을 수 없습니다');
        }

        const data = docSnap.data()!;
        const currentEntryIds = (data.entryIds || []) as string[];
        const updatedEntryIds = currentEntryIds.filter((id) => id !== entryId);
        const now = Timestamp.now().toDate();

        transaction.update(docRef, {
          entryIds: updatedEntryIds,
          updatedAt: now,
        });
      });
    },
  };
});

import { DocumentEntity } from '@/data/entity.types';
import { firebaseAdmin } from '@/data/server/firebaseAdmin.config';
import { Auth } from 'firebase-admin/auth';
import { DocumentData, Firestore } from 'firebase-admin/firestore';

export const serializeEntity = <T extends DocumentEntity>(data: DocumentData): T => {
  return {
    ...data,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
  } as T;
};

export const getFirebaseServerRepositoryCreator =
  <TCollectionName extends string>(collectionName: TCollectionName) =>
  <TRepository>(implementation: (params: { db: Firestore; auth: Auth; collectionName: TCollectionName }) => TRepository) => {
    return implementation({ db: firebaseAdmin.db, auth: firebaseAdmin.auth, collectionName });
  };

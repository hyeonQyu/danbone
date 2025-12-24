import { firebaseAdmin } from '@/data/firebaseAdmin.config';
import { Auth } from 'firebase-admin/auth';
import { Firestore } from 'firebase-admin/firestore';

export const getFirebaseRepositoryCreator =
  <TCollectionName extends string>(collectionName: TCollectionName) =>
  <TRepository>(implementation: (params: { db: Firestore; auth: Auth; collectionName: TCollectionName }) => TRepository) => {
    return implementation({ db: firebaseAdmin.db, auth: firebaseAdmin.auth, collectionName });
  };

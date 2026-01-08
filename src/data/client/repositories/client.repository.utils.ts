'use client';

import { firebase } from '@/data/client/firebase';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';

export const getFirebaseClientRepositoryCreator =
  <TCollectionName extends string>(collectionName: TCollectionName) =>
  <TRepository>(implementation: (params: { db: Firestore; auth: Auth; collectionName: TCollectionName }) => TRepository) => {
    return implementation({ db: firebase.db, auth: firebase.auth, collectionName });
  };

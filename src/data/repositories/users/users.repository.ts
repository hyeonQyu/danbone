import { getFirebaseRepositoryCreator } from '@/data/repositories/repository.utils';
import { UsersRepository } from '@/data/repositories/users/users.repository.types';
import { UserEntity } from '@/features/users/users.types';
import { Timestamp } from 'firebase-admin/firestore';

export const userRepository = getFirebaseRepositoryCreator('users')<UsersRepository>(({ db, auth, collectionName }) => {
  return {
    createUser: async ({ email, name, password }) => {
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: name,
      });

      const now = Timestamp.now().toDate();

      const userEntity: UserEntity = {
        id: userRecord.uid,
        email,
        name,
        createdAt: now,
        updatedAt: now,
      };

      await db.collection(collectionName).doc(userRecord.uid).set(userEntity);

      return userEntity;
    },

    getUserByEmail: async (email) => {
      const querySnapshot = await db.collection(collectionName).where('email', '==', email).limit(1).get();

      if (querySnapshot.empty) {
        return null;
      }

      return querySnapshot.docs[0].data() as UserEntity;
    },
  };
});

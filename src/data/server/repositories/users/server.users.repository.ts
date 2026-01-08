import { getFirebaseServerRepositoryCreator } from '@/data/server/repositories/server.repository.utils';
import { UsersServerRepository } from '@/data/server/repositories/users/server.users.repository.types';
import { UserEntity } from '@/features/users';
import { Timestamp } from 'firebase-admin/firestore';

export const usersServerRepository = getFirebaseServerRepositoryCreator('users')<UsersServerRepository>(({ db, auth, collectionName }) => {
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

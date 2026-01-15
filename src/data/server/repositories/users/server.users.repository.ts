import { getFirebaseServerRepositoryCreator, serializeEntity } from '@/data/server/repositories/server.repository.utils';
import { UsersServerRepository } from '@/data/server/repositories/users/server.users.repository.types';
import { UserEntity } from '@/features/users';
import { Timestamp } from 'firebase-admin/firestore';

export const usersServerRepository = getFirebaseServerRepositoryCreator('users')<UsersServerRepository>(({ db, auth, collectionName }) => {
  const collectionRef = db.collection(collectionName);

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

      await collectionRef.doc(userRecord.uid).set(userEntity);

      return userEntity;
    },

    getUserByEmail: async (email) => {
      const querySnapshot = await collectionRef.where('email', '==', email).limit(1).get();

      if (querySnapshot.empty) {
        return null;
      }

      return serializeEntity<UserEntity>(querySnapshot.docs[0].data());
    },

    getUserById: async (id) => {
      const doc = await collectionRef.doc(id).get();

      if (!doc.exists || !doc.data()) {
        return null;
      }

      return serializeEntity<UserEntity>(doc.data()!);
    },
  };
});

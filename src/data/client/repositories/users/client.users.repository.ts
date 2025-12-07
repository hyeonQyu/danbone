'use client';

import { getFirebaseClientRepositoryCreator } from '@/data/client/repositories/client.repository.utils';
import { UsersClientRepository } from '@/data/server/repositories/users';

export const usersClientRepository = getFirebaseClientRepositoryCreator('users')<UsersClientRepository>(({ auth }) => {
  return {
    getCurrentUser: () => auth.currentUser,
    onAuthStateChanged: (callback) => auth.onAuthStateChanged(callback),
  };
});

'use client';

import { getClientServiceCreator } from '@/data/client/service/client.service.utils';
import { UserClientService, UserClientServiceDependencies } from '@/data/client/service/user/client.user.service.types';
import { InvalidValueError, NotFoundError } from '@/errors';
import { AuthError, signInWithEmailAndPassword, signOut } from 'firebase/auth';

export const createUserClientService = getClientServiceCreator<UserClientService, UserClientServiceDependencies>(
  ({ usersRepository }, auth) => {
    return {
      login: async (data) => {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
          const [idToken, idTokenResult] = await Promise.all([userCredential.user.getIdToken(), userCredential.user.getIdTokenResult()]);

          return {
            user: {
              id: userCredential.user.uid,
              email: userCredential.user.email ?? '',
              name: userCredential.user.displayName ?? '',
            },
            idToken,
            refreshToken: userCredential.user.refreshToken,
            expiresIn: idTokenResult.expirationTime,
          };
        } catch (error: unknown) {
          switch ((error as AuthError).code) {
            case 'auth/invalid-email':
              throw new InvalidValueError('유효하지 않은 이메일 형식입니다.');
            case 'auth/user-disabled':
              throw new InvalidValueError('비활성화된 계정입니다.');
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
              throw new NotFoundError('이메일 또는 비밀번호가 올바르지 않습니다.');
            case 'auth/too-many-requests':
              throw new Error('로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.');
            default:
              throw new Error('로그인에 실패했습니다. 다시 시도해주세요.');
          }
        }
      },

      logout: async () => {
        await signOut(auth);
      },

      getCurrentUser: () => usersRepository.getCurrentUser(),

      onAuthStateChanged: (callback) => usersRepository.onAuthStateChanged(callback),
    };
  },
);

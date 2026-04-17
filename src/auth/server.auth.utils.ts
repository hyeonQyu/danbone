import { firebaseAdmin } from '@/data/server/firebaseAdmin.config';
import { AuthError, ExpiredTokenError } from '@/errors';
import { COOKIE } from '@/lib';
import { cookies } from 'next/headers';

export interface AuthData {
  uid: string;
  email: string | undefined;
}

export const verifyAuth = async (): Promise<AuthData> => {
  const cookieStore = await cookies();
  const idToken = cookieStore.get(COOKIE.idToken)?.value;

  if (!idToken) {
    throw new ExpiredTokenError('토큰이 존재하지 않습니다.');
  }

  try {
    const decodedToken = await firebaseAdmin.auth.verifyIdToken(idToken);

    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };
  } catch (err: unknown) {
    const firebaseError = err as { code?: string };
    if (firebaseError.code === 'auth/id-token-expired') {
      throw new ExpiredTokenError('토큰이 만료되었습니다.');
    } else if (firebaseError.code === 'auth/argument-error') {
      throw new AuthError('유효하지 않은 토큰 형식입니다. 다시 로그인해주세요.');
    }
    throw new AuthError('유효하지 않은 토큰입니다. 다시 로그인해주세요.');
  }
};

export const withAuth = async <T>(handler: (userId: string) => Promise<T>): Promise<T> => {
  const authData = await verifyAuth();
  return handler(authData.uid);
};

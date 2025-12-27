import { firebaseAdmin } from '@/data/server/firebaseAdmin.config';
import { AuthError } from '@/errors';
import { cookies } from 'next/headers';

export const verifyAuth = async () => {
  const cookieStore = await cookies();
  const idToken = cookieStore.get('idToken')?.value;

  if (!idToken) {
    throw new AuthError('인증되지 않은 요청입니다. 로그인이 필요합니다.');
  }

  try {
    const decodedToken = await firebaseAdmin.auth.verifyIdToken(idToken);

    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };
  } catch {
    throw new AuthError('유효하지 않은 토큰입니다. 다시 로그인해주세요.');
  }
};

export const withAuth = async <T>(handler: (userId: string) => Promise<T>): Promise<T> => {
  const { uid } = await verifyAuth();
  return handler(uid);
};

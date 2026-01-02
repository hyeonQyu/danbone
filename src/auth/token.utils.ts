'use client';

import { userServiceClient } from '@/data/client';
import { deleteCookie, setCookie, TIME_UNIT } from '@/lib';
import { User } from 'firebase/auth';

export const getCurrentUser = () => userServiceClient.getCurrentUser();
export const onAuthStateChanged = (callback: (user: User | null) => void) => userServiceClient.onAuthStateChanged(callback);

export const setIdTokenCookie = async (user: User): Promise<void> => {
  const [idToken, idTokenResult] = await Promise.all([user.getIdToken(), user.getIdTokenResult()]);

  const expiresAt = new Date(idTokenResult.expirationTime).getTime();
  const now = Date.now();
  const maxAgeInSeconds = Math.floor((expiresAt - now) / TIME_UNIT.unitOfMs.asSecond);

  setCookie('idToken', idToken, { maxAge: maxAgeInSeconds });
};

export const deleteIdTokenCookie = (): void => {
  deleteCookie('idToken');
};

export const syncTokenToCookie = async (): Promise<boolean> => {
  const user = getCurrentUser();
  if (!user) return false;
  await setIdTokenCookie(user);
  return true;
};

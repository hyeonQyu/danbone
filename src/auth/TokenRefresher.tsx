'use client';

import { firebase } from '@/data/client/firebase';
import { ReactNode, useEffect, useEffectEvent, useRef } from 'react';
import { deleteIdTokenCookie, setIdTokenCookie } from './token.utils';

function TokenRefresher({ children }: { children: ReactNode }) {
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const initTokenRefresh = useEffectEvent(() => {
    if (unsubscribeRef.current) {
      return;
    }

    unsubscribeRef.current = firebase.auth.onIdTokenChanged(async (user) => {
      if (user) {
        await setIdTokenCookie(user);
      } else {
        deleteIdTokenCookie();
      }
    });
  });

  const cleanupTokenRefresh = useEffectEvent(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
  });

  useEffect(() => {
    initTokenRefresh();

    return () => {
      cleanupTokenRefresh();
    };
  }, []);

  return <>{children}</>;
}

export default TokenRefresher;

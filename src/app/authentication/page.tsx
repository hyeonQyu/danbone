'use client';

import { onAuthStateChanged, syncTokenToCookie } from '@/auth';
import { Loading } from '@/components/Loading';
import { useRedirect, useTypedRouter, useTypedSearchParams } from '@/routes';
import { Box } from '@mui/material';
import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';

function AuthenticationPage() {
  const router = useTypedRouter();
  const searchParams = useTypedSearchParams('/authentication');
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const redirect = useRedirect(searchParams?.redirect);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      setAuthUser(user);
      setIsAuthLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!authUser) {
      router.replace('/login', { searchParams });
      return;
    }

    const syncAndRedirect = async () => {
      await syncTokenToCookie();
      redirect();
    };

    syncAndRedirect();
  }, [isAuthLoading, authUser, router, searchParams, redirect]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        gap: 2,
      }}
    >
      <Loading messages={['인증 확인 중...', '잠시만 기다려주세요...']} />
    </Box>
  );
}

export default AuthenticationPage;

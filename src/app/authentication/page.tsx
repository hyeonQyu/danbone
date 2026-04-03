'use client';

import { onAuthStateChanged, syncTokenToCookie } from '@/auth';
import { AppRoutesPathname, useTypedRouter, useTypedSearchParams } from '@/routes';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

function AuthenticationPage() {
  const router = useTypedRouter();
  const searchParams = useTypedSearchParams('/authentication');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAndSync = async () => {
      try {
        const user = await new Promise((resolve) => {
          const unsubscribe = onAuthStateChanged((user) => {
            unsubscribe();
            resolve(user);
          });
        });

        if (!user) {
          router.replace('/login');
          return;
        }

        const success = await syncTokenToCookie();

        if (success) {
          const redirect = searchParams?.redirect || '/';
          router.replace(redirect as AppRoutesPathname);
        } else {
          router.replace('/login');
        }
      } catch {
        setError('인증 처리 중 오류가 발생했습니다.');
      }
    };

    checkAndSync();
  }, [router, searchParams]);

  if (error) {
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
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

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
      <CircularProgress />
      <Typography>인증 확인 중...</Typography>
    </Box>
  );
}

export default AuthenticationPage;

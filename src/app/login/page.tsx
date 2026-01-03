'use client';

import { PageViewContainer } from '@/components/PageViewContainer';
import { LoginView } from '@/features/users';
import { useTypedRouter, useTypedSearchParams } from '@/routes';
import { useEffect } from 'react';

function LoginPage() {
  const router = useTypedRouter();
  const searchParams = useTypedSearchParams('/login');

  useEffect(() => {
    if (searchParams?.email) {
      router.replace('/login');
    }
  }, [searchParams?.email, router]);

  return (
    <PageViewContainer>
      <LoginView defaultEmail={searchParams?.email} redirectTo={searchParams?.redirect} />
    </PageViewContainer>
  );
}

export default LoginPage;

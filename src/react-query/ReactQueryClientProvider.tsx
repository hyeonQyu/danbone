'use client';

import { setIdTokenCookie } from '@/auth';
import { ERROR_NAME } from '@/errors';
import { getCurrentUser } from '@/features/users';
import { useTypedRouter } from '@/routes';
import { enqueueClosableSnackbar } from '@/styles';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, useState } from 'react';

export interface ReactQueryClientProviderProps {
  children: ReactNode | ReactNode[];
}

const syncTokenToCookie = async (): Promise<boolean> => {
  const user = getCurrentUser();
  if (!user) return false;
  await setIdTokenCookie(user);
  return true;
};

function ReactQueryClientProvider(props: ReactQueryClientProviderProps) {
  const { children } = props;

  const router = useTypedRouter();

  const handleAuthError = async (error: unknown): Promise<boolean> => {
    if (error instanceof Error) {
      const isExpiredTokenError = error.name === ERROR_NAME.expiredToken;
      if (isExpiredTokenError) {
        if (await syncTokenToCookie()) {
          return true;
        }
      }

      const isAuthError = error.name === ERROR_NAME.auth;
      if (isAuthError || isExpiredTokenError) {
        enqueueClosableSnackbar({
          message: error.message,
          variant: 'error',
        });

        router.push('/login');
        return false;
      }
    }

    return false;
  };

  const [queryClient] = useState(() => {
    const client = new QueryClient({
      queryCache: new QueryCache({
        onError: async (error, query) => {
          const shouldRetry = await handleAuthError(error);
          if (shouldRetry) {
            query.fetch();
          }
        },
      }),
      mutationCache: new MutationCache({
        onError: async (error) => {
          await handleAuthError(error);
        },
      }),
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: 0,
        },
        mutations: {
          retry: false,
        },
      },
    });
    return client;
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </QueryClientProvider>
  );
}

export default ReactQueryClientProvider;

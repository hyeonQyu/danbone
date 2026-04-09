'use client';

import { syncTokenToCookie } from '@/auth/token.utils';
import { ERROR_NAME } from '@/errors';
import { useMounted } from '@/hooks';
import { ReactQueryDevtools } from '@/react-query/ReactQueryDevtools';
import { useTypedRouter } from '@/routes';
import { enqueueClosableSnackbar } from '@/styles';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export interface ReactQueryClientProviderProps {
  children: ReactNode | ReactNode[];
}

function ReactQueryClientProvider(props: ReactQueryClientProviderProps) {
  const { children } = props;

  const router = useTypedRouter();
  const mounted = useMounted();

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
      {mounted && <ReactQueryDevtools initialIsOpen={false} />}
      {children}
    </QueryClientProvider>
  );
}

export default ReactQueryClientProvider;

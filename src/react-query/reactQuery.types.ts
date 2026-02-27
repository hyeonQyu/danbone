import { UseQueryOptions } from '@tanstack/react-query';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UseQueryOptionsByQueryFn<TQueryFn extends (...args: any[]) => Promise<any>> = Omit<
  UseQueryOptions<Awaited<ReturnType<TQueryFn>>>,
  'queryKey' | 'queryFn'
>;

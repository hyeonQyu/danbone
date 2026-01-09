import { TargetLanguage } from '@/language';
import { SearchParams } from '@hyeonqyu/typed-router-next';
import z from 'zod';

export type MinimalUser = {
  uid: string;
  email?: string;
};

export type RoutesServerContext = {
  user: MinimalUser | null;
};

export type RoutesClientContext = {
  targetLanguage: TargetLanguage;
  searchParams?: SearchParams;
};

export type RoutesContext = {
  server?: RoutesServerContext;
  client?: RoutesClientContext;
};

export const RedirectSearchParamsSchema = z.object({
  redirect: z.string().optional(),
});

export type RedirectSearchParams = z.infer<typeof RedirectSearchParamsSchema>;

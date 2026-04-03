import z from 'zod';

export type MinimalUser = {
  uid: string;
  email?: string;
};

export type RoutesContext = {
  user: MinimalUser | null;
};

export const RedirectSearchParamsSchema = z.object({
  redirect: z.string().optional(),
});

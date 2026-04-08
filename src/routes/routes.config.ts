import { DictionaryEntryWithLanguageSchema } from '@/features/dictionary';
import { RedirectSearchParamsSchema, RoutesContext } from '@/routes/routes.types';
import { accessibleOnLoggedIn, accessibleOnLoggedOut } from '@/routes/routes.utils';
import { BaseMetadata, createAppRoutes } from '@hyeonqyu/typed-router-next';
import z from 'zod';

export const appRoutes = {
  authentication: {
    _metadata: {
      searchParamsSchema: RedirectSearchParamsSchema,
    },
  },
  signup: {
    _metadata: {
      accessible: accessibleOnLoggedOut,
    },
  },
  login: {
    _metadata: {
      accessible: accessibleOnLoggedOut,
      searchParamsSchema: RedirectSearchParamsSchema.extend({
        email: z.string().email().optional(),
      }).optional(),
    },
  },
  explore: {
    _metadata: {
      accessible: accessibleOnLoggedIn,
    },
    search: {
      _metadata: {
        accessible: accessibleOnLoggedIn,
      },
      detail: {
        _metadata: {
          accessible: accessibleOnLoggedIn,
          searchParamsSchema: DictionaryEntryWithLanguageSchema,
        },
      },
    },
  },
} as const satisfies Parameters<ReturnType<typeof createAppRoutes<BaseMetadata, RoutesContext>>>[0];

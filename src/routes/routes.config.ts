import { DictionaryEntryWithLanguageSchema } from '@/features/dictionary';
import { getLanguageLabel } from '@/language';
import { RedirectSearchParamsSchema, RoutesContext } from '@/routes/routes.types';
import { accessibleOnLoggedIn, accessibleOnLoggedOut, getExploreTitle } from '@/routes/routes.utils';
import { BaseMetadata, createAppRoutes } from '@hyeonqyu/typed-router-next';
import z from 'zod';

export const appRoutes = {
  authentication: {
    _metadata: {
      title: () => '인증 확인중...',
      searchParamsSchema: RedirectSearchParamsSchema,
    },
  },
  signup: {
    _metadata: {
      title: () => '회원가입',
      accessible: accessibleOnLoggedOut,
    },
  },
  login: {
    _metadata: {
      title: () => '로그인',
      accessible: accessibleOnLoggedOut,
      searchParamsSchema: RedirectSearchParamsSchema.extend({
        email: z.string().email().optional(),
      }).optional(),
    },
  },
  explore: {
    _metadata: {
      title: getExploreTitle,
      accessible: accessibleOnLoggedIn,
    },
    search: {
      _metadata: {
        title: getExploreTitle,
        accessible: accessibleOnLoggedIn,
      },
      detail: {
        _metadata: {
          title: ({ client }) => {
            if (!client) return '단어 상세 보기';
            const { searchParams } = client;
            const { language, notations } = DictionaryEntryWithLanguageSchema.parse(searchParams);
            return `${getLanguageLabel(language)} - ${notations[0]}`;
          },
          searchParamsSchema: DictionaryEntryWithLanguageSchema,
        },
      },
    },
  },
} as const satisfies Parameters<ReturnType<typeof createAppRoutes<BaseMetadata, RoutesContext>>>[0];

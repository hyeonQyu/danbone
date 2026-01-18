import { RedirectSearchParamsSchema, RoutesContext } from '@/routes/routes.types';
import { accessibleOnLoggedIn, accessibleOnLoggedOut, getExploreTitle, getVocabularyTitle } from '@/routes/routes.utils';
import { createAppRoutes } from '@hyeonqyu/typed-router-next';
import { Book, BookOutlined, Explore, ExploreOutlined } from '@mui/icons-material';
import { ComponentType } from 'react';
import z from 'zod';

type AppMetadata = {
  icon?: {
    outlined: ComponentType;
    filled: ComponentType;
  };
};

const DetailSearchParamsSchema = z.object({
  id: z.string(),
});

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
      icon: {
        outlined: ExploreOutlined,
        filled: Explore,
      },
      label: () => '탐색하기',
    },
    search: {
      _metadata: {
        title: getExploreTitle,
        accessible: accessibleOnLoggedIn,
      },
      '[id]': {
        _metadata: {
          title: () => '단어 상세 보기',
          searchParamsSchema: DetailSearchParamsSchema,
        },
      },
    },
  },
  vocabulary: {
    _metadata: {
      title: getVocabularyTitle,
      accessible: accessibleOnLoggedIn,
      icon: {
        outlined: BookOutlined,
        filled: Book,
      },
      label: () => '단어장',
    },
    book: {
      '[id]': {
        _metadata: {
          title: getVocabularyTitle,
          accessible: accessibleOnLoggedIn,
        },
      },
    },
  },
} as const satisfies Parameters<ReturnType<typeof createAppRoutes<AppMetadata, RoutesContext>>>[0];

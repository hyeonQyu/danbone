import { DictionaryEntryWithLanguageSchema } from '@/features/dictionary/dictionary.types';
import { BaseMetadata, createAppRoutes } from '@hyeonqyu/typed-router-next';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { AppRoutesProvider, TypedLink, useAppRoutes, useCurrentRouteNode, useTypedPathname, useTypedRouter, useTypedSearchParams, _types } =
  createAppRoutes<BaseMetadata, null>()({
    login: {
      _metadata: {},
    },
    explore: {
      _metadata: {},
      search: {
        _metadata: {},
        detail: {
          _metadata: {
            searchParamsSchema: DictionaryEntryWithLanguageSchema,
          },
        },
      },
    },
  });

export { AppRoutesProvider, TypedLink, useAppRoutes, useCurrentRouteNode, useTypedPathname, useTypedRouter, useTypedSearchParams };

export type AppRoutesMetadata = typeof _types.AppRoutesMetadata;
export type AppRoutesContext = typeof _types.AppRoutesContext;
export type AppRoutesPathname = typeof _types.AppRoutesPathname;

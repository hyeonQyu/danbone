import { BaseMetadata, createAppRoutes } from '@hyeonqyu/typed-router-next';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { AppRoutesProvider, TypedLink, useAppRoutes, useCurrentRouteNode, useTypedPathname, useTypedRouter, _types } = createAppRoutes<
  BaseMetadata,
  null
>()({
  login: {
    _metadata: {},
  },
  explore: {
    _metadata: {},
    search: {
      _metadata: {},
    },
  },
});

export { AppRoutesProvider, TypedLink, useAppRoutes, useCurrentRouteNode, useTypedPathname, useTypedRouter };

export type AppRoutesMetadata = typeof _types.AppRoutesMetadata;
export type AppRoutesContext = typeof _types.AppRoutesContext;
export type AppRoutesPathname = typeof _types.AppRoutesPathname;

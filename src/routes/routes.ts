'use client';

import { appRoutes } from '@/routes/routes.config';
import { RoutesContext } from '@/routes/routes.types';
import { BaseMetadata, createAppRoutes } from '@hyeonqyu/typed-router-next';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { AppRoutesProvider, TypedLink, useAppRoutes, useCurrentRouteNode, useTypedPathname, useTypedRouter, useTypedSearchParams, _types } =
  createAppRoutes<BaseMetadata, RoutesContext>()(appRoutes);

export { AppRoutesProvider, TypedLink, useAppRoutes, useCurrentRouteNode, useTypedPathname, useTypedRouter, useTypedSearchParams };

export type AppRoutesMetadata = typeof _types.AppRoutesMetadata;
export type AppRoutesContext = typeof _types.AppRoutesContext;
export type AppRoutesPathname = typeof _types.AppRoutesPathname;

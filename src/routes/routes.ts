'use client';

import { appRoutes } from '@/routes/routes.config';
import { RoutesContext } from '@/routes/routes.types';
import { BaseMetadata, createAppRoutes } from '@hyeonqyu/typed-router-next';
import { ComponentType } from 'react';

type AppMetadata = BaseMetadata & {
  icon?: {
    outlined: ComponentType;
    filled: ComponentType;
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const {
  AppRoutesProvider,
  TypedLink,
  useAppRoutes,
  useCurrentRouteNode,
  useTypedPathname,
  useTypedRouter,
  useTypedSearchParams,
  getPathnameFromNode,
  _types,
} = createAppRoutes<AppMetadata, RoutesContext>()(appRoutes);

export {
  AppRoutesProvider,
  getPathnameFromNode,
  TypedLink,
  useAppRoutes,
  useCurrentRouteNode,
  useTypedPathname,
  useTypedRouter,
  useTypedSearchParams,
};

export type AppRoutesMetadata = typeof _types.AppRoutesMetadata;
export type AppRoutesContext = typeof _types.AppRoutesContext;
export type AppRoutesPathname = typeof _types.AppRoutesPathname;
export type AppRouteNode = typeof _types.AppRouteNode;

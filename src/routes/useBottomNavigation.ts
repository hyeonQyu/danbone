import { getPathnameFromNode, useAppRoutes, useTypedPathname } from '@/routes/routes';
import { useMemo } from 'react';

export const useBottomNavigation = () => {
  const currentPathname = useTypedPathname();
  const appRoutes = useAppRoutes();

  const navigationProps = useMemo(() => {
    const navigationRouteNodes = [appRoutes.explore] as const;

    return navigationRouteNodes.map((routeNode) => {
      const pathname = getPathnameFromNode(routeNode) ?? '';
      const label = routeNode._metadata.label();

      return {
        pathname,
        label,
        iconOutlined: routeNode._metadata?.icon?.outlined,
        iconFilled: routeNode._metadata?.icon?.filled,
      };
    });
  }, [appRoutes]);

  const currentNavigationIndex = useMemo(() => {
    const index = navigationProps.findIndex((item) => currentPathname.startsWith(item.pathname));
    return index;
  }, [currentPathname, navigationProps]);

  return {
    navigationData: navigationProps,
    currentNavigationIndex,
  };
};

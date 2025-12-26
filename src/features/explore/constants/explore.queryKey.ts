import { ExploreSearchOption } from '@/features/explore/types';

export const EXPLORE_QUERY_KEY = {
  all: () => ['explore'] as const,
  search: {
    all: () => [...EXPLORE_QUERY_KEY.all(), 'search'] as const,
    get: (option: ExploreSearchOption) => [...EXPLORE_QUERY_KEY.search.all(), option],
  },
};

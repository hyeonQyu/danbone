import { searchJA } from '@/features/explore/actions';
import { EXPLORE_QUERY_KEY } from '@/features/explore/constants/explore.queryKey';
import { ExploreSearchHandler, ExploreSearchOption } from '@/features/explore/types';
import { TargetLanguage, useTargetLanguage } from '@/language';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

const searchHandlerGeneratorsByTargetLanguage = {
  ja: searchJA,
} as const satisfies Record<TargetLanguage, ExploreSearchHandler<object>>;

export const useQueryExploreSearch = (req: ExploreSearchOption, queryOptions: Omit<UseQueryOptions, 'queryKey' | 'queryFn'>) => {
  const targetLanguage = useTargetLanguage();
  const search = searchHandlerGeneratorsByTargetLanguage[targetLanguage];

  return useQuery({
    queryKey: EXPLORE_QUERY_KEY.search.get(req),
    queryFn: () => search(req),
    ...queryOptions,
  });
};

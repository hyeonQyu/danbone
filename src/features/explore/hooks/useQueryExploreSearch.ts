import { searchJA } from '@/features/explore/actions';
import { EXPLORE_QUERY_KEY } from '@/features/explore/constants/explore.queryKey';
import { ExploreSearchHandler, ExploreSearchOption } from '@/features/explore/types';
import { TargetLanguage, useTargetLanguage } from '@/language';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

const searchHandlerGeneratorsByTargetLanguage = {
  ja: searchJA,
} as const satisfies Record<TargetLanguage, ExploreSearchHandler<object>>;

type SearchResultJA = Awaited<ReturnType<typeof searchJA>>;

type SearchResultByLanguage = {
  ja: SearchResultJA;
};

export const useQueryExploreSearch = <TLang extends TargetLanguage = TargetLanguage>(
  req: ExploreSearchOption,
  queryOptions?: Omit<UseQueryOptions<SearchResultByLanguage[TLang]>, 'queryKey' | 'queryFn'>,
) => {
  const targetLanguage = useTargetLanguage();
  const search = searchHandlerGeneratorsByTargetLanguage[targetLanguage];

  return useQuery<SearchResultByLanguage[TLang]>({
    queryKey: EXPLORE_QUERY_KEY.search.get(req),
    queryFn: () => search(req) as Promise<SearchResultByLanguage[TLang]>,
    ...queryOptions,
  });
};

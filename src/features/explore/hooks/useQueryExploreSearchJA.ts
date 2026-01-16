import { searchJA } from '@/features/explore/actions';
import { EXPLORE_QUERY_KEY } from '@/features/explore/constants/explore.queryKey';
import { ExploreSearchOption } from '@/features/explore/types';
import { serverAction } from '@/lib';
import { UseQueryOptionsByQueryFn } from '@/react-query/reactQuery.types';
import { useQuery } from '@tanstack/react-query';

export const useQueryExploreSearchJA = (req: ExploreSearchOption, queryOptions?: UseQueryOptionsByQueryFn<typeof searchJA>) => {
  return useQuery({
    queryKey: EXPLORE_QUERY_KEY.search.get(req),
    queryFn: serverAction(() => searchJA(req)),
    ...queryOptions,
  });
};

import { useExploreQueryLanguage } from '@/features/explore/hooks/useExploreQueryLanguage';
import { useExploreStore } from '@/features/explore/stores/explore.store';
import { ExploreSearchOption } from '@/features/explore/types';
import { useSourceLanguage } from '@/language';

export const useExploreSearchOption = (): ExploreSearchOption => {
  const query = useExploreStore((store) => store.query);
  const { queryLanguage } = useExploreQueryLanguage();
  const sourceLanguage = useSourceLanguage();

  return { query, queryLanguage, sourceLanguage };
};

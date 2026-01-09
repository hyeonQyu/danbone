import { useExploreSearchOption } from '@/features/explore/hooks/useExploreSearchOption';
import { useQueryExploreSearchJA } from '@/features/explore/hooks/useQueryExploreSearchJA';
import { useExploreStore } from '@/features/explore/stores';
import { Language, useTargetLanguage } from '@/language';
import { useEffect } from 'react';

export const useQueryExploreSearch = () => {
  const request = useExploreSearchOption();

  const shouldSearch = useExploreStore((store) => store.shouldSearch);
  const finishSearch = useExploreStore((store) => store.finishSearch);

  const targetLanguage = useTargetLanguage();

  const getEnabled = (language: Language) => {
    return Boolean(request.query) && targetLanguage === language && shouldSearch;
  };

  const {
    data: jaResults,
    isFetching: isSearchingJA,
    error: jaError,
    isError: isJAError,
    status: jaStatus,
  } = useQueryExploreSearchJA(request, { enabled: getEnabled('ja') });

  const isSearching = isSearchingJA;
  const error = jaError;
  const isError = isJAError;
  const isCompleted = [jaStatus].some((status) => status === 'success' || status === 'error');

  useEffect(() => {
    if (isCompleted) {
      finishSearch();
    }
  }, [isCompleted, finishSearch]);

  return {
    jaResults,
    isSearching,
    error,
    isError,
  };
};

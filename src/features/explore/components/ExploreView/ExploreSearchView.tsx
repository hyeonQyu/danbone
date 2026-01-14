'use client';

import { ErrorView } from '@/components/ErrorView';
import { ExploreSearchJAResults } from '@/features/explore/components/ExploreSearchResult';
import { ExploreSearchViewTemplate } from '@/features/explore/components/ExploreSearchViewTemplate';
import { useExploreQueryLanguage, useQueryExploreSearch } from '@/features/explore/hooks';
import { useExploreStore } from '@/features/explore/stores';

function ExploreSearchView() {
  const query = useExploreStore((store) => store.query);
  const startSearch = useExploreStore((store) => store.startSearch);
  const { queryLanguage } = useExploreQueryLanguage();

  const { jaResults, isSearching, error, isError } = useQueryExploreSearch();

  const handleSearch = (value: string) => {
    startSearch(value);
  };

  return (
    <ExploreSearchViewTemplate
      query={query}
      queryLanguage={queryLanguage}
      isSearching={isSearching}
      onSearch={handleSearch}
      renderResults={() => {
        if (isError && error) {
          const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.\n다시 시도해주세요.';
          return <ErrorView title="검색에 실패했습니다" message={errorMessage} />;
        }

        if (jaResults) {
          return <ExploreSearchJAResults results={jaResults} />;
        }

        return null;
      }}
    />
  );
}

export default ExploreSearchView;

'use client';

import ExploreSearchErrorResult from '@/features/explore/components/ExploreSearchErrorResult/ExploreSearchErrorResult';
import { ExploreSearchJAResults } from '@/features/explore/components/ExploreSearchResult';
import { ExploreSearchViewTemplate } from '@/features/explore/components/ExploreSearchViewTemplate';
import { useQueryExploreSearch } from '@/features/explore/hooks';
import { useExploreQueryLanguage } from '@/features/explore/hooks/useExploreQueryLanguage';
import { useExploreStore } from '@/features/explore/stores';

function ExploreSearchView() {
  const query = useExploreStore((store) => store.query);
  const setQuery = useExploreStore((store) => store.setQuery);
  const { queryLanguage } = useExploreQueryLanguage();

  const { jaResults, isSearching, error, isError } = useQueryExploreSearch();

  const handleSearch = (value: string) => {
    setQuery(value);
  };

  return (
    <ExploreSearchViewTemplate
      query={query}
      queryLanguage={queryLanguage}
      isSearching={isSearching}
      onSearch={handleSearch}
      renderResults={() => {
        if (isError && error) {
          return <ExploreSearchErrorResult error={error} />;
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

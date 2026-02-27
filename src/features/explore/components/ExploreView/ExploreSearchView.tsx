'use client';

import { ExploreSearchJAResults } from '@/features/explore/components/ExploreSearchResult';
import { ExploreSearchViewTemplate } from '@/features/explore/components/ExploreSearchViewTemplate';
import { useQueryExploreSearchJA } from '@/features/explore/hooks';
import { useExploreStore } from '@/features/explore/stores';
import { ExploreSearchOption, ExploreSearchResult } from '@/features/explore/types';
import { Language, useSourceLanguage, useTargetLanguage } from '@/language';
import { DictionaryEntryByLanguage } from '@/openai';
import { useState } from 'react';

// 더미 데이터
const DUMMY_JA_RESULTS: Array<ExploreSearchResult<DictionaryEntryByLanguage['ja']>> = [
  {
    text: '上手 元気',
    entries: [
      {
        keyword: '上手',
        results: [
          {
            notation: '上手',
            pronunciation: 'じょうず',
            meanings: ['능숙한', '잘하는'],
            pos: 'naAdjective',
            examples: ['日本語が上手です', '料理が上手だ'],
          },
          {
            notation: '上手',
            pronunciation: 'じょうず',
            meanings: ['고수', '능숙한 사람'],
            pos: 'noun',
            examples: ['彼はピアノの上手だ'],
          },
        ],
      },
      {
        keyword: '元気',
        results: [
          {
            notation: '元気',
            pronunciation: 'げんき',
            meanings: ['건강한', '활기찬'],
            pos: 'naAdjective',
            examples: ['元気な子供', '元気に過ごす'],
          },
          {
            notation: '元気',
            pronunciation: 'げんき',
            meanings: ['건강', '활기'],
            pos: 'noun',
            examples: ['元気がない', '元気をもらう'],
          },
        ],
      },
    ],
  },
  {
    text: '元気',
    entries: [
      {
        keyword: '元気',
        results: [
          {
            notation: '元気',
            pronunciation: 'げんき',
            meanings: ['건강한', '활기찬'],
            pos: 'naAdjective',
            examples: ['元気な子供', '元気に過ごす'],
          },
          {
            notation: '元気',
            pronunciation: 'げんき',
            meanings: ['건강', '활기'],
            pos: 'noun',
            examples: ['元気がない', '元気をもらう'],
          },
        ],
      },
    ],
  },
];

function ExploreSearchView() {
  const [query, setQuery] = useState('');

  const sourceLanguage = useSourceLanguage();
  const targetLanguage = useTargetLanguage();
  const queryLanguage = useExploreStore((store) => store.queryLanguage);

  const getEnabled = (language: Language) => {
    return Boolean(query) && targetLanguage === language;
  };

  const request: ExploreSearchOption = { query, queryLanguage, sourceLanguage };

  const { data: jaResults, isFetching: isSearchingJA } = useQueryExploreSearchJA(request, { enabled: getEnabled('ja') });

  const isSearching = isSearchingJA;

  const handleSearch = (value: string) => {
    // setQuery(value);
  };

  return (
    <ExploreSearchViewTemplate
      query={query}
      queryLanguage={queryLanguage}
      isSearching={isSearching}
      onSearch={handleSearch}
      renderResults={() => {
        const resultsToDisplay = jaResults ?? DUMMY_JA_RESULTS;

        if (resultsToDisplay) {
          return <ExploreSearchJAResults results={resultsToDisplay} />;
        }

        return '데이터 없음';
      }}
    />
  );
}

export default ExploreSearchView;

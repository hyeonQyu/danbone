import { useExploreSearchOption } from '@/features/explore/hooks/useExploreSearchOption';
import { useQueryExploreSearchJA } from '@/features/explore/hooks/useQueryExploreSearchJA';
import { ExploreSearchResult } from '@/features/explore/types';
import { useTargetLanguage } from '@/language';
import { Language } from '@/language/language.types';
import { DictionaryWordByLanguage } from '@/openai';

// 더미 데이터
const DUMMY_JA_RESULTS: Array<ExploreSearchResult<DictionaryWordByLanguage['ja']>> = [
  {
    text: '上手 元気',
    words: [
      {
        keyword: '上手',
        entries: [
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
        entries: [
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
    words: [
      {
        keyword: '元気',
        entries: [
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

export const useQueryExploreSearch = () => {
  const request = useExploreSearchOption();

  const targetLanguage = useTargetLanguage();

  const getEnabled = (language: Language) => {
    return Boolean(request.query) && targetLanguage === language;
  };

  const {
    data: jaResults,
    isFetching: isSearchingJA,
    error: jaError,
    isError: isJAError,
  } = useQueryExploreSearchJA(request, { enabled: getEnabled('ja') });

  const isSearching = isSearchingJA;
  const error = jaError;
  const isError = isJAError;

  return {
    jaResults: jaResults ?? DUMMY_JA_RESULTS,
    isSearching,
    error,
    isError,
  };
};

import { DictionaryEntryByLanguage } from '@/features/dictionary/dictionary.types';
import { useExploreSearchOption } from '@/features/explore/hooks/useExploreSearchOption';
import { useQueryExploreSearchJA } from '@/features/explore/hooks/useQueryExploreSearchJA';
import { useExploreStore } from '@/features/explore/stores';
import { ExploreSearchResult } from '@/features/explore/types';
import { Language, useTargetLanguage } from '@/language';
import { useEffect } from 'react';

// 더미 데이터 (개발/테스트용)
const DUMMY_JA_RESULTS: Array<ExploreSearchResult<DictionaryEntryByLanguage['ja']>> = [
  {
    text: '짧은 단어 2개 테스트',
    entries: [
      {
        id: 'dummy-1',
        kanji: [{ common: true, text: 'お化け', tags: [] }],
        kana: [
          {
            common: true,
            text: 'おばけ',
            tags: [],
            appliesToKanji: ['お化け'],
          },
        ],
        sense: [
          {
            partOfSpeech: ['noun'],
            appliesToKanji: [],
            appliesToKana: [],
            related: [],
            antonym: [],
            field: [],
            dialect: [],
            misc: [],
            info: [],
            languageSource: [],
            gloss: [
              { lang: 'ko', gender: null, type: null, text: '유령' },
              { lang: 'ko', gender: null, type: null, text: '귀신' },
            ],
          },
        ],
      },
    ],
  },
];

const USE_DUMMY_DATA = false; // 더미 데이터 사용 여부

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

  // 더미 데이터 사용 시
  // if (USE_DUMMY_DATA && targetLanguage === 'ja') {
  //   return {
  //     jaResults: DUMMY_JA_RESULTS,
  //     isSearching: false,
  //     error: null,
  //     isError: false,
  //   };
  // }

  return {
    jaResults: DUMMY_JA_RESULTS,
    isSearching,
    error,
    isError,
  };
};

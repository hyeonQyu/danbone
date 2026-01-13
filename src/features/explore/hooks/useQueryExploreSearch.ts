import { useExploreSearchOption } from '@/features/explore/hooks/useExploreSearchOption';
import { useQueryExploreSearchJA } from '@/features/explore/hooks/useQueryExploreSearchJA';
import { useExploreStore } from '@/features/explore/stores';
import { ExploreSearchResult } from '@/features/explore/types';
import { Language, useTargetLanguage } from '@/language';
import { DictionaryWordByLanguage } from '@/openai';
import { useEffect } from 'react';

// 더미 데이터 (개발/테스트용)
const DUMMY_JA_RESULTS: Array<ExploreSearchResult<DictionaryWordByLanguage['ja']>> = [
  {
    text: '짧은 단어 2개 테스트',
    words: [
      {
        keyword: 'お化け',
        entries: [
          {
            notations: ['お化け', '御化け'],
            pronunciations: ['おばけ', 'オバケ'],
            meanings: ['유령', '귀신'],
            partOfSpeeches: ['noun'],
            examples: [],
          },
        ],
      },
    ],
  },
  {
    text: '긴 단어 2개 테스ト',
    words: [
      {
        keyword: '疑問符付き感嘆符',
        entries: [
          {
            notations: ['疑問符付き感嘆符', 'エクスクラメーションマーク'],
            pronunciations: ['ぎもんふつきかんたんふ', 'エクスクラメーションマーク'],
            meanings: ['물음표가 붙은 느낌표', '느낌표'],
            partOfSpeeches: ['noun'],
            examples: [],
          },
        ],
      },
    ],
  },
  {
    text: '짧은 단어 4개 테스트',
    words: [
      {
        keyword: '食べる',
        entries: [
          {
            notations: ['食べる', 'たべる', '喰べる', '食う'],
            pronunciations: ['たべる', 'くう', 'タベル', 'クウ'],
            meanings: ['먹다', '섭취하다'],
            partOfSpeeches: ['ichidanVerb'],
            examples: [],
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

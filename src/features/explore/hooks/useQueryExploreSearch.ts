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
    text: '取りあえず',
    entries: [
      {
        id: '1598980',
        kanji: [
          {
            common: false,
            text: '取りあえず',
            tags: [],
          },
          {
            common: false,
            text: '取り敢えず',
            tags: [],
          },
          {
            common: false,
            text: '取敢えず',
            tags: ['sK'],
          },
          {
            common: false,
            text: '取り合えず',
            tags: ['sK'],
          },
          {
            common: false,
            text: '取合えず',
            tags: ['sK'],
          },
        ],
        kana: [
          {
            common: true,
            text: 'とりあえず',
            tags: [],
            appliesToKanji: ['*'],
          },
        ],
        sense: [
          {
            appliesToKanji: ['*'],
            appliesToKana: ['*'],
            related: [],
            antonym: [],
            field: [],
            dialect: [],
            misc: ['uk'],
            info: [],
            languageSource: [],
            partOfSpeech: ['adverb'],
            gloss: [
              {
                lang: 'eng',
                gender: null,
                type: null,
                text: 'first of all',
              },
              {
                lang: 'eng',
                gender: null,
                type: null,
                text: 'at once',
              },
              {
                lang: 'eng',
                gender: null,
                type: null,
                text: 'right away',
              },
            ],
          },
          {
            appliesToKanji: ['*'],
            appliesToKana: ['*'],
            related: [],
            antonym: [],
            field: [],
            dialect: [],
            misc: ['uk'],
            info: [],
            languageSource: [],
            partOfSpeech: ['adverb'],
            gloss: [
              {
                lang: 'eng',
                gender: null,
                type: null,
                text: 'for now',
              },
              {
                lang: 'eng',
                gender: null,
                type: null,
                text: 'for the time being',
              },
              {
                lang: 'eng',
                gender: null,
                type: null,
                text: 'tentatively',
              },
            ],
          },
          {
            appliesToKanji: ['*'],
            appliesToKana: ['*'],
            related: [],
            antonym: [],
            field: [],
            dialect: [],
            misc: ['uk'],
            info: [],
            languageSource: [],
            partOfSpeech: ['adverb'],
            gloss: [
              {
                lang: 'eng',
                gender: null,
                type: null,
                text: 'anyway',
              },
              {
                lang: 'eng',
                gender: null,
                type: null,
                text: 'at least',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    text: '責任 面倒',
    entries: [
      {
        id: '1383180',
        kanji: [
          {
            common: true,
            text: '責任',
            tags: [],
          },
        ],
        kana: [
          {
            common: true,
            text: 'せきにん',
            tags: [],
            appliesToKanji: ['*'],
          },
        ],
        sense: [
          {
            appliesToKanji: ['*'],
            appliesToKana: ['*'],
            related: [],
            antonym: [],
            field: [],
            dialect: [],
            misc: [],
            info: [],
            languageSource: [],
            partOfSpeech: ['noun'],
            gloss: [
              {
                lang: 'eng',
                gender: null,
                type: null,
                text: 'duty',
              },
              {
                lang: 'eng',
                gender: null,
                type: null,
                text: 'responsibility (incl. supervision of staff)',
              },
            ],
          },
          {
            appliesToKanji: ['*'],
            appliesToKana: ['*'],
            related: [],
            antonym: [],
            field: [],
            dialect: [],
            misc: [],
            info: [],
            languageSource: [],
            partOfSpeech: ['noun'],
            gloss: [
              {
                lang: 'eng',
                gender: null,
                type: null,
                text: 'liability',
              },
              {
                lang: 'eng',
                gender: null,
                type: null,
                text: 'onus',
              },
            ],
          },
        ],
      },
      {
        id: '1533550',
        kanji: [
          {
            common: true,
            text: '面倒',
            tags: ['ateji'],
          },
        ],
        kana: [
          {
            common: true,
            text: 'めんどう',
            tags: [],
            appliesToKanji: ['*'],
          },
        ],
        sense: [
          {
            appliesToKanji: ['*'],
            appliesToKana: ['*'],
            related: [],
            antonym: [],
            field: [],
            dialect: [],
            misc: [],
            info: [],
            languageSource: [],
            partOfSpeech: ['noun', 'naAdjective'],
            gloss: [
              {
                lang: 'eng',
                gender: null,
                type: null,
                text: 'trouble',
              },
              {
                lang: 'eng',
                gender: null,
                type: null,
                text: 'bother',
              },
            ],
          },
          {
            appliesToKanji: ['*'],
            appliesToKana: ['*'],
            related: [],
            antonym: [],
            field: [],
            dialect: [],
            misc: [],
            info: [],
            languageSource: [],
            partOfSpeech: ['noun', 'naAdjective'],
            gloss: [
              {
                lang: 'eng',
                gender: null,
                type: null,
                text: 'trouble',
              },
              {
                lang: 'eng',
                gender: null,
                type: null,
                text: 'difficulty',
              },
            ],
          },
          {
            appliesToKanji: ['*'],
            appliesToKana: ['*'],
            related: [],
            antonym: [],
            field: [],
            dialect: [],
            misc: [],
            info: [],
            languageSource: [],
            partOfSpeech: ['noun'],
            gloss: [
              {
                lang: 'eng',
                gender: null,
                type: null,
                text: 'care',
              },
              {
                lang: 'eng',
                gender: null,
                type: null,
                text: 'attention',
              },
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

'use server';

import { jmdictServiceServer } from '@/data/server';
import { FindByTermParams } from '@/data/server/services/jmdict';
import { InvalidValueError } from '@/errors';
import { JmdictEntity, JmdictGloss, JmdictSense } from '@/features/dictionary';
import { ExploreSearchHandler } from '@/features/explore/types';
import { jmdictLanguageToDanboneLanguage, TargetLanguage } from '@/language';
import { devLogError, devLogTap } from '@/lib';
import { checkResultFulfilled, checkResultRejected } from '@/lib/promise.utils';
import {
  DictionaryInput,
  DictionaryWordByLanguage,
  getRunner,
  inputValidatorAgentFactory,
  jaDictionaryAgentFactory,
  jaMorphologicalAnalyzerAgentFactory,
  LocalizedText,
  queryNormalizerAgentFactory,
  TranslationSource,
  translatorAgentFactory,
} from '@/openai';
import { withUsageTracking } from '@/openai/tracking';
import { identity } from 'es-toolkit';

const MAX_QUERY_LENGTH = 50;

const runner = getRunner();

const inputValidatorAgent = inputValidatorAgentFactory.createAgent('gpt-4.1-mini');
const queryNormalizerAgent = queryNormalizerAgentFactory.createAgent('gpt-4.1-mini');
const translatorAgent = translatorAgentFactory.createAgent('gpt-4o-mini');
const jaMorphologicalAnalyzerAgent = jaMorphologicalAnalyzerAgentFactory.createAgent('gpt-4o-mini');
const jaDictionaryAgent = jaDictionaryAgentFactory.createAgent('gpt-4.1-mini-detailed');

const checkQueryLength = (query: string) => {
  return query.length <= MAX_QUERY_LENGTH;
};

const validateQuery = async (input: LocalizedText) => {
  return runner.run(inputValidatorAgent, JSON.stringify(input));
};

const normalizeQuery = async (input: LocalizedText) => {
  return runner.run(queryNormalizerAgent, JSON.stringify(input));
};

const translateQuery = async (input: TranslationSource) => {
  return runner.run(translatorAgent, JSON.stringify(input));
};

const morphologicalAnalysisJA = async (input: string) => {
  return runner.run(jaMorphologicalAnalyzerAgent, input);
};

const jaWordToSearchParam = (word: string): FindByTermParams => {
  // TODO termType 추론
  return {
    searchTerm: word,
    termType: 'kanji',
  };
};

const getJmdictEntries = async (word: string) => {
  const searchParam = jaWordToSearchParam(word);
  try {
    return await jmdictServiceServer.findByTerm(searchParam);
  } catch (e) {
    devLogError('❌ JMdict 용어 조회 실패:', word);
    devLogError('❌ 검색 파라미터:', searchParam);
    devLogError('❌ 에러:', e);
    return [];
  }
};

const getJmtdictSenseLanguage = (sense: JmdictSense) => {
  return jmdictLanguageToDanboneLanguage(sense.gloss[0]?.lang);
};

const checkJmtSenseLanguage = (checkingLanguage: string) => (sense: JmdictSense) => {
  return getJmtdictSenseLanguage(sense) === checkingLanguage;
};

const getDictionaryWordsJA2 = async ({ sourceLanguage, words }: DictionaryInput) => {
  const checkJmdictEntryHasSourceLanguageSense = (entry: JmdictEntity) => {
    return entry.sense.some(checkJmtSenseLanguage(sourceLanguage));
  };

  // TODO: 실제 번역 API 호출 또는 AI 번역 로직
  const translateGlossToSourceLanguage = async (gloss: JmdictGloss[]): Promise<JmdictGloss[]> => {
    return gloss.map((g) => ({
      ...g,
      lang: sourceLanguage,
      // text: await translateText(gloss.text, targetLang), // 실제 번역 필요
    }));
  };

  const addSourceLanguageSenseToJmdictEntry = async (entry: JmdictEntity): Promise<JmdictEntity> => {
    const englishSenses = entry.sense.filter(checkJmtSenseLanguage('en'));

    const newSourceLanguageSense = await Promise.all(
      englishSenses.map(async (sense) => {
        const sourceLanguageGloss = await translateGlossToSourceLanguage(sense.gloss);
        return { ...sense, gloss: sourceLanguageGloss };
      }),
    );

    return {
      ...entry,
      sense: [...entry.sense, ...newSourceLanguageSense],
    };
  };

  const searchedWordsWithJmtdictEntries = (await Promise.allSettled(words.map(getJmdictEntries))).filter(checkResultFulfilled());

  const wordsWithJmtdictEntriesWithUpdated = await Promise.all(
    searchedWordsWithJmtdictEntries.map(({ value: jmtdictEntries }) => {
      return Promise.all(
        jmtdictEntries.map(async (jmtdictEntry) => {
          if (checkJmdictEntryHasSourceLanguageSense(jmtdictEntry)) {
            return {
              entry: jmtdictEntry,
              updated: false,
            };
          }

          return {
            entry: await addSourceLanguageSenseToJmdictEntry(jmtdictEntry),
            updated: true,
          };
        }),
      );
    }),
  );

  const updatedEntries = wordsWithJmtdictEntriesWithUpdated
    .flat()
    .filter(({ updated }) => updated)
    .map(({ entry }) => entry);

  if (updatedEntries.length > 0) {
    await jmdictServiceServer.updateEntries(updatedEntries);
  }

  // 조회된 결과 데이터 정제 후 반환
};

const getDictionaryWordsJA = async (input: DictionaryInput) => {
  return runner.run(jaDictionaryAgent, JSON.stringify(input));
};

const _searchJA: ExploreSearchHandler<DictionaryWordByLanguage['ja']> = async ({ query, queryLanguage, sourceLanguage }) => {
  const TARGET_LANGUAGE: TargetLanguage = 'ja' as const;

  const getTranslatedJATexts = async (normalizedQuery: string) => {
    if (queryLanguage === TARGET_LANGUAGE) {
      return [normalizedQuery];
    }

    const translatedTextsResult = await translateQuery({
      sourceLanguage,
      targetLanguage: TARGET_LANGUAGE,
      text: normalizedQuery,
    });

    return devLogTap(translatedTextsResult.finalOutput?.texts, '번역된 문자열') ?? [];
  };

  const getNormalizedJATexts = async () => {
    if (!checkQueryLength(query)) {
      throw new InvalidValueError(`검색어는 ${MAX_QUERY_LENGTH}자 이하로 입력해주세요.`);
    }

    const inputValidatedResult = await validateQuery({ language: queryLanguage, text: query });

    if (!inputValidatedResult.finalOutput?.valid) {
      throw new InvalidValueError('적절하지 않은 검색어입니다.\n다시 입력해주세요.');
    }

    const queryNormalizedResult = await normalizeQuery({ language: queryLanguage, text: query });
    const normalizedQuery = devLogTap(queryNormalizedResult.finalOutput?.text, '정규화된 검색어');

    if (!normalizedQuery) {
      throw new InvalidValueError('적절하지 않은 검색어입니다.\n다시 입력해주세요.\n(정규화 실패)');
    }

    const translatedJATexts = await getTranslatedJATexts(normalizedQuery);

    if (!translatedJATexts.length) {
      throw new InvalidValueError('번역에 실패했습니다.\n다시 입력해주세요.');
    }

    return translatedJATexts;
  };

  const getDictionaryWords = async (normalizedJAText: string) => {
    const morphologicalAnalysisResult = await morphologicalAnalysisJA(normalizedJAText);
    const tokens = devLogTap(morphologicalAnalysisResult.finalOutput?.tokens, '형태소 분리된 토큰');

    if (!tokens?.length) {
      throw new InvalidValueError('형태소 분석에 실패했습니다.\n다시 입력해주세요.');
    }

    const dictionaryWords = await getDictionaryWordsJA({ sourceLanguage, words: tokens.map(({ base }) => base) });
    const words = dictionaryWords.finalOutput?.words;

    if (!words?.length) {
      throw new InvalidValueError('사전 검색에 실패했습니다.\n다시 입력해주세요.');
    }

    return words;
  };

  const normalizedJATexts = devLogTap(await getNormalizedJATexts(), '정규화된 일본어 문자열');

  const results = await Promise.allSettled(
    normalizedJATexts.map(async (text) => {
      const words = await getDictionaryWords(text);
      return { text, words };
    }),
  );

  const dictionaryWordsByNormalizedJAText = results.filter(checkResultFulfilled()).map(({ value }) => value);
  const firstRejection = results.find(checkResultRejected());

  if (firstRejection) {
    throw new Error(firstRejection.reason);
  }

  return dictionaryWordsByNormalizedJAText;
};

export const searchJA = withUsageTracking('searchJA', _searchJA, {
  extractMetadata: identity,
});

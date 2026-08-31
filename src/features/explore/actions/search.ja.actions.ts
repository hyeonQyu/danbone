'use server';

import { InvalidValueError } from '@/errors';
import { ExploreSearchHandler } from '@/features/explore/types';
import { TargetLanguage } from '@/language';
import { devLogTap } from '@/lib';
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

const getDictionaryWordsJA = async (input: DictionaryInput) => {
  return runner.run(jaDictionaryAgent, JSON.stringify(input));
};

const _searchJA: ExploreSearchHandler<DictionaryWordByLanguage['ja']> = async ({ query, queryLanguage, sourceLanguage }) => {
  const TARGET_LANGUAGE: TargetLanguage = 'ja' as const;

  const getTranslatedTexts = async (normalizedQuery: string) => {
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

    const translatedTexts = await getTranslatedTexts(normalizedQuery);

    if (!translatedTexts.length) {
      throw new InvalidValueError('번역에 실패했습니다.\n다시 입력해주세요.');
    }

    return translatedTexts;
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

  const dictionaryWordsByNormalizedJAText = results
    .filter((result) => result.status === 'fulfilled')
    .map((result) => (result as PromiseFulfilledResult<{ text: string; words: DictionaryWordByLanguage['ja'][] }>).value);

  if (!dictionaryWordsByNormalizedJAText.length) {
    const firstRejection = results.find((result) => result.status === 'rejected') as PromiseRejectedResult;
    throw firstRejection.reason;
  }

  return dictionaryWordsByNormalizedJAText;
};

export const searchJA = withUsageTracking('searchJA', _searchJA, {
  extractMetadata: identity,
});

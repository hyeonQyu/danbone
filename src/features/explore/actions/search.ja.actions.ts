'use server';

import { InvalidValueError } from '@/errors';
import { ExploreSearchHandler } from '@/features/explore/types';
import { TargetLanguage } from '@/language';
import {
  DictionaryInput,
  DictionaryResultSchemaByLanguage,
  getRunner,
  inputValidatorAgentFactory,
  jaDictionaryAgentFactory,
  jaMorphologicalAnalyzerAgentFactory,
  LocalizedText,
  queryNormalizerAgentFactory,
  translatorAgentFactory,
} from '@/openai';
import z from 'zod';

type DictionaryJAFormat = z.infer<typeof DictionaryResultSchemaByLanguage.ja>;

const MAX_QUERY_LENGTH = 50;

const runner = getRunner();

const inputValidatorAgent = inputValidatorAgentFactory.createAgent('gpt-5-nano');
const queryNormalizerAgent = queryNormalizerAgentFactory.createAgent('gpt-5-nano');
const translatorAgent = translatorAgentFactory.createAgent('gpt-5-nano');
const jaMorphologicalAnalyzerAgent = jaMorphologicalAnalyzerAgentFactory.createAgent('gpt-5-nano');
const jaDictionaryAgent = jaDictionaryAgentFactory.createAgent('gpt-5-nano');

const checkQueryLength = (query: string) => {
  return query.length <= MAX_QUERY_LENGTH;
};

const validateQuery = async (input: LocalizedText) => {
  return runner.run(inputValidatorAgent, JSON.stringify(input));
};

const normalizeQuery = async (input: LocalizedText) => {
  return runner.run(queryNormalizerAgent, JSON.stringify(input));
};

const translateQuery = async (input: LocalizedText) => {
  return runner.run(translatorAgent, JSON.stringify(input));
};

const morphologicalAnalysisJA = async (input: string) => {
  return runner.run(jaMorphologicalAnalyzerAgent, input);
};

const getDictionaryEntriesJA = async (input: DictionaryInput) => {
  return runner.run(jaDictionaryAgent, JSON.stringify(input));
};

export const searchJA: ExploreSearchHandler<DictionaryJAFormat> = async ({ query, queryLanguage, sourceLanguage }) => {
  const TARGET_LANGUAGE: TargetLanguage = 'ja' as const;

  const getTranslatedTexts = async (normalizedQuery: string) => {
    if (queryLanguage === TARGET_LANGUAGE) {
      return [normalizedQuery];
    }

    const translatedTexts = await translateQuery({ language: queryLanguage, text: normalizedQuery });
    return translatedTexts.finalOutput?.texts ?? [];
  };

  const getNormalizedJATexts = async () => {
    if (!checkQueryLength(query)) {
      throw new InvalidValueError(`검색어는 ${MAX_QUERY_LENGTH}자 이하로 입력해주세요.`);
    }

    const inputValidatedResult = await validateQuery({ language: queryLanguage, text: query });

    if (!inputValidatedResult.finalOutput?.valid) {
      throw new InvalidValueError('적절하지 않은 검색어입니다. 다시 입력해주세요.');
    }

    const queryNormalizedResult = await normalizeQuery({ language: queryLanguage, text: query });
    const normalizedQuery = queryNormalizedResult.finalOutput?.text;

    if (!normalizedQuery) {
      throw new InvalidValueError('적절하지 않은 검색어입니다. 다시 입력해주세요.');
    }

    const translatedTexts = await getTranslatedTexts(normalizedQuery);

    if (!translatedTexts.length) {
      throw new InvalidValueError('번역에 실패했습니다. 다시 입력해주세요.');
    }

    return translatedTexts;
  };

  const getDictionaryEntries = async (normalizedJAText: string) => {
    const morphologicalAnalysisResult = await morphologicalAnalysisJA(normalizedJAText);
    const tokens = morphologicalAnalysisResult.finalOutput?.tokens;

    if (!tokens?.length) {
      throw new InvalidValueError('형태소 분석에 실패했습니다. 다시 입력해주세요.');
    }

    const dictionaryEntries = await getDictionaryEntriesJA({ sourceLanguage, words: tokens.map(({ base }) => base) });
    const entries = dictionaryEntries.finalOutput?.entries;

    if (!entries?.length) {
      throw new InvalidValueError('사전 검색에 실패했습니다. 다시 입력해주세요.');
    }

    return entries;
  };

  const normalizedJATexts = await getNormalizedJATexts();

  const dictionaryEntriesByNormalizedJAText = await Promise.all(
    normalizedJATexts.map(async (text) => {
      const entries = await getDictionaryEntries(text);
      return { text, entries };
    }),
  );

  return dictionaryEntriesByNormalizedJAText;
};

'use server';

import { jmdictServiceServer } from '@/data/server';
import { FindByTermParams } from '@/data/server/services/jmdict';
import { InvalidValueError } from '@/errors';
import {
  convertJmdictEntityToDictionaryEntry,
  DictionaryEntryByLanguage,
  JmdictEntity,
  JmdictGloss,
  JmdictSense,
} from '@/features/dictionary';
import { ExploreSearchHandler } from '@/features/explore';
import { jmdictLanguageToDanboneLanguage, TargetLanguage } from '@/language';
import {
  checkResultFulfilled,
  checkResultRejected,
  devLog,
  devLogError,
  devLogTap,
  hasAlphabet,
  hasKanji,
  isHiragana,
  isKatakana,
  overSome,
} from '@/lib';
import {
  getRunner,
  inputValidatorAgentFactory,
  jaMorphologicalAnalyzerAgentFactory,
  JmdictTranslationParams,
  jmdictTranslatorAgentFactory,
  LocalizedText,
  queryNormalizerAgentFactory,
  TranslationSource,
  translatorAgentFactory,
} from '@/openai';
import { DictionaryInput } from '@/openai/schemes/dictionary.scheme';
import { withUsageTracking } from '@/openai/tracking';
import { identity } from 'es-toolkit';

const MAX_QUERY_LENGTH = 50;

const runner = getRunner();

const inputValidatorAgent = inputValidatorAgentFactory.createAgent('gpt-4.1-mini');
const queryNormalizerAgent = queryNormalizerAgentFactory.createAgent('gpt-4.1-mini');
const translatorAgent = translatorAgentFactory.createAgent('gpt-4o-mini');
const jaMorphologicalAnalyzerAgent = jaMorphologicalAnalyzerAgentFactory.createAgent('gpt-4o-mini');
const jmdictTranslatorAgent = jmdictTranslatorAgentFactory.createAgent('gpt-4o-mini');

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

const translateJmdictSense = async (input: JmdictTranslationParams) => {
  return runner.run(jmdictTranslatorAgent, JSON.stringify(input));
};

const jaWordToSearchParam = (word: string): FindByTermParams => {
  if (overSome(hasKanji, hasAlphabet)(word)) {
    return {
      searchTerm: word,
      termType: 'kanji',
    };
  }

  if (overSome(isHiragana, isKatakana)(word)) {
    return {
      searchTerm: word,
      termType: 'kana',
    };
  }

  devLogError('❌ 유효하지 않은 일본어 단어 형식:', word);
  throw new InvalidValueError(`유효하지 않은 일본어 단어 형식: ${word}`);
};

const getJmdictEntries = async (word: string): Promise<JmdictEntity[]> => {
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

const getJmdictSenseLanguage = (sense: JmdictSense) => {
  return jmdictLanguageToDanboneLanguage(sense.gloss[0]?.lang);
};

const checkJmtSenseLanguage = (checkingLanguage: string) => (sense: JmdictSense) => {
  return getJmdictSenseLanguage(sense) === checkingLanguage;
};

const getDictionaryEntriesJA = async ({ sourceLanguage, words }: DictionaryInput): Promise<DictionaryEntryByLanguage['ja'][]> => {
  const checkJmdictEntryHasSourceLanguageSense = (entry: JmdictEntity) => {
    return entry.sense.some(checkJmtSenseLanguage(sourceLanguage));
  };

  const translateGlossToSourceLanguage = async (params: Omit<JmdictTranslationParams, 'sourceLanguage'>): Promise<JmdictGloss[]> => {
    const { finalOutput } = await translateJmdictSense({ ...params, sourceLanguage });

    if (!finalOutput?.texts) {
      throw new Error('상세 번역 결과를 추출할 수 없습니다.\n다시 입력해주세요.');
    }

    return finalOutput.texts.map((text, index) => ({
      ...params.glosses[index],
      lang: sourceLanguage,
      text,
    }));
  };

  const addSourceLanguageSenseToJmdictEntry = async (entry: JmdictEntity): Promise<JmdictEntity> => {
    const enSenses = entry.sense.filter(checkJmtSenseLanguage('en'));

    const newSourceLanguageSense = await Promise.all(
      enSenses.map(async (sense) => {
        const sourceLanguageGloss = await translateGlossToSourceLanguage({
          kanjis: entry.kanji.map(({ text }) => text),
          kanas: entry.kana.map(({ text }) => text),
          glosses: sense.gloss,
        });
        return { ...sense, gloss: sourceLanguageGloss };
      }),
    );

    return {
      ...entry,
      sense: [...entry.sense, ...newSourceLanguageSense],
    };
  };

  const searchResults = (await Promise.allSettled(words.map(getJmdictEntries))).filter(checkResultFulfilled);

  const entriesWithUpdateStatus = (
    await Promise.all(
      searchResults.map(({ value: jmdictEntries }) => {
        return Promise.all(
          jmdictEntries.map(async (jmdictEntry) => {
            if (checkJmdictEntryHasSourceLanguageSense(jmdictEntry)) {
              return {
                entry: jmdictEntry,
                updated: false,
              };
            }

            return {
              entry: await addSourceLanguageSenseToJmdictEntry(jmdictEntry),
              updated: true,
            };
          }),
        );
      }),
    )
  ).flat();

  const updatedEntries = entriesWithUpdateStatus.filter(({ updated }) => updated).map(({ entry }) => entry);
  devLog(
    updatedEntries.map(({ id, kanji, kana }) => ({
      id,
      kanji: kanji.map(({ text }) => text).join(','),
      kana: kana.map(({ text }) => text).join(','),
    })),
    '업데이트된 사전 항목 ID',
  );

  if (updatedEntries.length > 0) {
    await jmdictServiceServer.updateEntries(updatedEntries);
  }

  return entriesWithUpdateStatus.map(({ entry }) => convertJmdictEntityToDictionaryEntry(entry, sourceLanguage));
};

const _searchJA: ExploreSearchHandler<DictionaryEntryByLanguage['ja']> = async ({ query, queryLanguage, sourceLanguage }) => {
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

  const getDictionaryEntries = async (normalizedJAText: string) => {
    const morphologicalAnalysisResult = await morphologicalAnalysisJA(normalizedJAText);
    const tokens = devLogTap(morphologicalAnalysisResult.finalOutput?.tokens, '형태소 분리된 토큰');

    if (!tokens?.length) {
      throw new InvalidValueError('형태소 분석에 실패했습니다.\n다시 입력해주세요.');
    }

    const entries = await getDictionaryEntriesJA({ sourceLanguage, words: tokens.map(({ base }) => base) });

    if (!entries?.length) {
      throw new InvalidValueError('사전 검색에 실패했습니다.\n다시 입력해주세요.');
    }

    return entries;
  };

  const normalizedJATexts = devLogTap(await getNormalizedJATexts(), '정규화된 일본어 문자열');

  const searchResults = await Promise.allSettled(
    normalizedJATexts.map(async (text) => {
      const entries = await getDictionaryEntries(text);
      return { text, entries };
    }),
  );

  const entriesByNormalizedText = searchResults.filter(checkResultFulfilled).map(({ value }) => value);
  const firstRejection = searchResults.find(checkResultRejected);

  if (firstRejection) {
    throw new Error(firstRejection.reason);
  }

  return entriesByNormalizedText;
};

export const searchJA = withUsageTracking('searchJA', _searchJA, {
  extractMetadata: identity,
});

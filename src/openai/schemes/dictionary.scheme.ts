import { Language } from '@/language';
import { LanguageSchema } from '@/openai/schemes';
import z from 'zod';

export const PartOfSpeechSchemaByLanguage: Record<Language, z.ZodEnum<[string, ...string[]]>> = {
  ko: z.enum(['verb', 'noun', 'adjective', 'adverb', 'preposition', 'conjunction', 'article', 'interjection']),
  ja: z.enum([
    'godanVerb',
    'ichidanVerb',
    'irregularVerb',
    'noun',
    'naAdjective',
    'iAdjective',
    'adverb',
    'preposition',
    'conjunction',
    'interjection',
  ]),
};

export const DictionaryFormatSchemaByLanguage: Record<Language, z.AnyZodObject> = {
  ko: z.object({
    notation: z.string(),
    pronunciation: z.string(),
    meanings: z.array(z.string()),
    pos: PartOfSpeechSchemaByLanguage['ko'],
    examples: z.array(z.string()),
  }),
  ja: z.object({
    notation: z.string(),
    pronunciation: z.string(),
    meanings: z.array(z.string()).min(1).max(3),
    pos: PartOfSpeechSchemaByLanguage['ja'],
    examples: z.array(z.string()).min(1).max(2),
  }),
};

export const DictionaryInputSchema = z.object({
  sourceLanguage: LanguageSchema,
  words: z.array(z.string()),
});

// 단일 키워드 결과 스키마 (언어별) - 코드로 자동 생성
export const DictionaryResultSchemaByLanguage: Record<Language, z.AnyZodObject> = Object.entries(DictionaryFormatSchemaByLanguage).reduce(
  (acc, [language, schema]) => {
    acc[language as Language] = z.object({
      keyword: z.string(),
      results: z.array(schema),
    });
    return acc;
  },
  {} as Record<Language, z.AnyZodObject>,
);

// 전체 출력 스키마 (언어별) - 키워드 결과들의 배열을 담은 객체
export const DictionaryOutputSchemaByLanguage: Record<Language, z.AnyZodObject> = Object.entries(DictionaryResultSchemaByLanguage).reduce(
  (acc, [language, schema]) => {
    acc[language as Language] = z.object({
      entries: z.array(schema),
    });
    return acc;
  },
  {} as Record<Language, z.AnyZodObject>,
);

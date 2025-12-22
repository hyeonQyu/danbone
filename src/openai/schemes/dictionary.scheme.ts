import { Language } from '@/language';
import { LanguageSchema } from '@/openai/schemes';
import z from 'zod';

export const PartOfSpeechSchemaByLanguage = {
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
} as const;

export const DictionaryFormatSchemaByLanguage = {
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
} as const;

export const DictionaryInputSchema = z.object({
  sourceLanguage: LanguageSchema,
  words: z.array(z.string()),
});

const createDictionarySchemasForLanguage = <T extends Record<string, z.ZodTypeAny>>(formatSchemas: T) => {
  type ResultSchemas = {
    [K in keyof T]: z.ZodObject<{
      keyword: z.ZodString;
      results: z.ZodArray<T[K]>;
    }>;
  };

  type OutputSchemas = {
    [K in keyof ResultSchemas]: z.ZodObject<{
      entries: z.ZodArray<ResultSchemas[K]>;
    }>;
  };

  const resultSchemas = Object.fromEntries(
    Object.entries(formatSchemas).map(([lang, schema]) => [
      lang,
      z.object({
        keyword: z.string(),
        results: z.array(schema),
      }),
    ]),
  ) as ResultSchemas;

  const outputSchemas = Object.fromEntries(
    Object.entries(resultSchemas).map(([lang, schema]) => [
      lang,
      z.object({
        entries: z.array(schema),
      }),
    ]),
  ) as OutputSchemas;

  return { resultSchemas, outputSchemas };
};

const { resultSchemas, outputSchemas } = createDictionarySchemasForLanguage(DictionaryFormatSchemaByLanguage);

export const DictionaryResultSchemaByLanguage = resultSchemas;
export const DictionaryOutputSchemaByLanguage = outputSchemas;

export type DictionaryOutput = z.infer<(typeof DictionaryOutputSchemaByLanguage)[Language]>;
export type DictionaryResult = z.infer<(typeof DictionaryResultSchemaByLanguage)[Language]>;
export type DictionaryInput = z.infer<typeof DictionaryInputSchema>;
export type DictionaryFormat = z.infer<(typeof DictionaryFormatSchemaByLanguage)[Language]>;
export type PartOfSpeech = z.infer<(typeof PartOfSpeechSchemaByLanguage)[Language]>;

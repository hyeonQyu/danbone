import { DictionaryFormatSchemaByLanguage } from '@/features/dictionary';
import { LanguageSchema } from '@/openai/schemes';
import z from 'zod';

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

export type DictionaryEntryByLanguage = {
  [K in keyof typeof DictionaryResultSchemaByLanguage]: z.infer<(typeof DictionaryResultSchemaByLanguage)[K]>;
};

export type DictionaryInput = z.infer<typeof DictionaryInputSchema>;

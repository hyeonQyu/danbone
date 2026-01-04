import { DictionaryEntrySchemaByLanguage } from '@/features/dictionary';
import { LanguageSchema } from '@/language';
import z from 'zod';

export const DictionaryInputSchema = z.object({
  sourceLanguage: LanguageSchema,
  words: z.array(z.string()),
});

const createDictionarySchemasForLanguage = <T extends Record<string, z.ZodTypeAny>>(entrySchemas: T) => {
  type WordSchemas = {
    [K in keyof T]: z.ZodObject<{
      keyword: z.ZodString;
      entries: z.ZodArray<T[K]>;
    }>;
  };

  type OutputSchemas = {
    [K in keyof WordSchemas]: z.ZodObject<{
      words: z.ZodArray<WordSchemas[K]>;
    }>;
  };

  const wordSchemas = Object.fromEntries(
    Object.entries(entrySchemas).map(([lang, schema]) => [
      lang,
      z.object({
        keyword: z.string(),
        entries: z.array(schema),
      }),
    ]),
  ) as WordSchemas;

  const outputSchemas = Object.fromEntries(
    Object.entries(wordSchemas).map(([lang, schema]) => [
      lang,
      z.object({
        words: z.array(schema),
      }),
    ]),
  ) as OutputSchemas;

  return { wordSchemas, outputSchemas };
};

const { wordSchemas, outputSchemas } = createDictionarySchemasForLanguage(DictionaryEntrySchemaByLanguage);

export const DictionaryWordSchemaByLanguage = wordSchemas;
export const DictionaryOutputSchemaByLanguage = outputSchemas;

export type DictionaryWordByLanguage = {
  [K in keyof typeof DictionaryWordSchemaByLanguage]: z.infer<(typeof DictionaryWordSchemaByLanguage)[K]>;
};

export type DictionaryInput = z.infer<typeof DictionaryInputSchema>;

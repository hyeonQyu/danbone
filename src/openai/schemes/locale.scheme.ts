import { LANGUAGES } from '@/language';
import z from 'zod';

export const LanguageSchema = z.enum(LANGUAGES);

export const LocalizedTextSchema = z.object({
  language: LanguageSchema,
  text: z.string(),
});

export const TranslationSourceSchema = z.object({
  text: z.string(),
  sourceLanguage: LanguageSchema,
  targetLanguage: LanguageSchema,
});

export const LocalizedTextsSchema = z.object({
  language: LanguageSchema,
  texts: z.array(z.string()),
});

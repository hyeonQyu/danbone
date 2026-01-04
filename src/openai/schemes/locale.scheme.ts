import { LanguageSchema } from '@/language';
import z from 'zod';

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

export type LocalizedText = z.infer<typeof LocalizedTextSchema>;
export type TranslationSource = z.infer<typeof TranslationSourceSchema>;
export type LocalizedTexts = z.infer<typeof LocalizedTextsSchema>;

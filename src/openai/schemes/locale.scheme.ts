import { LANGUAGES } from '@/language';
import z from 'zod';

export const LocalizedTextSchema = z.object({
  language: z.enum(LANGUAGES),
  text: z.string(),
});

export const TranslationSourceSchema = z.object({
  text: z.string(),
  sourceLanguage: z.enum(LANGUAGES),
  targetLanguage: z.enum(LANGUAGES),
});

export const LocalizedTextsSchema = z.object({
  language: z.enum(LANGUAGES),
  texts: z.array(z.string()),
});

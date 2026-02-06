import { LANGUAGES } from '@/language';
import z from 'zod';

export const validatorSchema = z.object({
  valid: z.boolean(),
});

export const localizedTextSchema = z.object({
  language: z.enum(LANGUAGES),
  text: z.string(),
});

export const translationSourceSchema = z.object({
  text: z.string(),
  sourceLanguage: z.enum(LANGUAGES),
  targetLanguage: z.enum(LANGUAGES),
});

export const localizedTextsSchema = z.object({
  language: z.enum(LANGUAGES),
  texts: z.array(z.string()),
});

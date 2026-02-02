import { LANGUAGES } from '@/language';
import z from 'zod';

export const validatorSchema = z.object({
  valid: z.boolean(),
});

export const queryUnitSchema = z.enum(['word', 'sentence']);

export const queryLangSchema = z.enum(['ko', 'ja', 'ja_kor_input']);

export const queryClassifierOutputSchema = z.object({
  unit: queryUnitSchema,
  lang: queryLangSchema,
  text: z.string(),
});

export const localizedTextSchema = z.object({
  language: z.enum(LANGUAGES),
  text: z.string(),
});

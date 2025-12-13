import z from 'zod';

export const guardrailOutputSchema = z.object({
  valid: z.boolean(),
});

export const queryUnitSchema = z.enum(['word', 'sentence']);

export const queryLangSchema = z.enum(['ko', 'ja', 'ja_kor_input']);

export const queryClassifierOutputSchema = z.object({
  unit: queryUnitSchema,
  lang: queryLangSchema,
  text: z.string(),
});

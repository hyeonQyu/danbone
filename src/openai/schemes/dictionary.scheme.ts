import { Language } from '@/language';
import z from 'zod';

export const PartOfSpeechSchemaByLanguageSchema: Record<Language, z.ZodEnum<[string, ...string[]]>> = {
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

export const MorphologicalTokenSchema = z.object({
  surface: z.string(),
  base: z.string(),
});

export const MorphologicalAnalysisResultSchema = z.object({
  tokens: z.array(MorphologicalTokenSchema),
});

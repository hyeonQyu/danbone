import { Language, LANGUAGES } from '@/language';
import z from 'zod';

const createTokenSchema = <T extends z.ZodEnum<[string, ...string[]]>>(pos: T) =>
  z.object({
    surface: z.string(),
    base: z.string(),
    pos,
  });

const createMorphAnalysisResultSchema = <T extends z.ZodEnum<[string, ...string[]]>>(pos: T) =>
  z.object({
    tokens: z.array(createTokenSchema(pos)),
  });

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

export const MorphAnalysisResultSchemeByLanguageSchema = LANGUAGES.reduce(
  (acc, language) => {
    acc[language] = createMorphAnalysisResultSchema(PartOfSpeechSchemaByLanguageSchema[language]);
    return acc;
  },
  {} as Record<Language, ReturnType<typeof createMorphAnalysisResultSchema<z.ZodEnum<[string, ...string[]]>>>>,
);

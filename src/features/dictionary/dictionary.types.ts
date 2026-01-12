import { Language } from '@/language';
import z from 'zod';

export const PartOfSpeechSchemaByLanguage = {
  ko: z.enum(['verb', 'noun', 'adjective', 'adverb', 'particle', 'conjunction', 'article', 'interjection']),
  ja: z.enum([
    'godanVerb',
    'ichidanVerb',
    'irregularVerb',
    'noun',
    'naAdjective',
    'iAdjective',
    'adverb',
    'particle',
    'conjunction',
    'interjection',
  ]),
} as const;

export const DictionaryEntrySchemaByLanguage = {
  ko: z.object({
    notations: z.array(z.string()).min(1),
    pronunciations: z.array(z.string()).min(1),
    meanings: z.array(z.string()),
    partOfSpeeches: z.array(PartOfSpeechSchemaByLanguage['ko']),
    examples: z.array(z.string()).default([]),
  }),
  ja: z.object({
    notations: z.array(z.string()).min(1),
    pronunciations: z.array(z.string()).min(1),
    meanings: z.array(z.string()).min(1),
    partOfSpeeches: z.array(PartOfSpeechSchemaByLanguage['ja']),
    examples: z.array(z.string()).default([]),
  }),
} as const;

export type PartOfSpeechByLanguage = {
  [K in keyof typeof PartOfSpeechSchemaByLanguage]: z.infer<(typeof PartOfSpeechSchemaByLanguage)[K]>;
};

export type DictionaryEntryByLanguage = {
  [K in keyof typeof DictionaryEntrySchemaByLanguage]: z.infer<(typeof DictionaryEntrySchemaByLanguage)[K]>;
};

export type DictionaryEntryWithLanguage = {
  [K in keyof typeof DictionaryEntrySchemaByLanguage]: {
    language: K;
  } & z.infer<(typeof DictionaryEntrySchemaByLanguage)[K]>;
}[keyof typeof DictionaryEntrySchemaByLanguage];

export type DictionaryEntryWithLanguageByLanguage<L extends keyof typeof DictionaryEntrySchemaByLanguage> = {
  language: L;
} & z.infer<(typeof DictionaryEntrySchemaByLanguage)[L]>;

const getDictionaryEntryWithLanguageSchemaOption = (language: Language) => {
  return z.object({ language: z.literal(language) }).merge(DictionaryEntrySchemaByLanguage[language]);
};

export const DictionaryEntryWithLanguageSchema = z.discriminatedUnion('language', [
  getDictionaryEntryWithLanguageSchemaOption('ko'),
  getDictionaryEntryWithLanguageSchemaOption('ja'),
]);

import { Language } from '@/language';
import z from 'zod';
import { JmdictKanaSchema, JmdictKanjiSchema, JmdictSenseSchema } from './jmdict.types';

export const PartOfSpeechSchemaByLanguage = {
  ko: z.enum(['verb', 'noun', 'adjective', 'adverb', 'particle', 'conjunction', 'article', 'interjection']),
  ja: z.enum([
    'godanVerb',
    'ichidanVerb',
    'irregularVerb',
    'auxiliary',
    'auxiliaryVerb',
    'auxiliaryAdjective',
    'copula',
    'noun',
    'counter',
    'naAdjective',
    'iAdjective',
    'adverb',
    'particle',
    'conjunction',
    'interjection',
    'expression',
    'prefix',
    'suffix',
  ]),
} as const;

export const DictionarySenseSchemaByLanguage = {
  ja: JmdictSenseSchema.extend({
    partOfSpeech: z.array(PartOfSpeechSchemaByLanguage['ja']),
  }),
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
    id: z.string(),
    kanji: z.array(JmdictKanjiSchema),
    kana: z.array(JmdictKanaSchema),
    sense: z.array(DictionarySenseSchemaByLanguage.ja),
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

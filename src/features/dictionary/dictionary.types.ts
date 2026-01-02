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
    notation: z.string(),
    pronunciation: z.string(),
    meanings: z.array(z.string()),
    pos: PartOfSpeechSchemaByLanguage['ko'],
    examples: z.array(z.string()),
  }),
  ja: z.object({
    notation: z.string(),
    pronunciation: z.string(),
    meanings: z.array(z.string()).min(1).max(3),
    pos: PartOfSpeechSchemaByLanguage['ja'],
    examples: z.array(z.string()).min(1).max(2),
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

export const DictionaryEntryWithLanguageSchema = z.custom<DictionaryEntryWithLanguage>((data) => {
  if (!data || typeof data !== 'object') return false;
  const { language, ...entry } = data as DictionaryEntryWithLanguageByLanguage<Language>;

  if (!(language in DictionaryEntrySchemaByLanguage)) return false;

  try {
    DictionaryEntrySchemaByLanguage[language as keyof typeof DictionaryEntrySchemaByLanguage].parse(entry);
    return true;
  } catch {
    return false;
  }
});

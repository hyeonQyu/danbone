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

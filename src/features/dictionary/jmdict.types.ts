import z from 'zod';

export const JmdictKanjiTagSchema = z.enum(['ateji', 'iK', 'io', 'oK', 'rK', 'sK']);
export const JmdictKanaTagSchema = z.enum(['gikun', 'ik', 'ok', 'rk', 'sk']);

export const JmdictPartOfSpeechSchema = z.enum([
  'adj-f',
  'adj-i',
  'adj-ix',
  'adj-ku',
  'adj-na',
  'adj-no',
  'adj-pn',
  'adj-t',
  'adv',
  'adv-to',
  'aux',
  'aux-adj',
  'aux-v',
  'conj',
  'cop',
  'ctr',
  'exp',
  'int',
  'n',
  'n-pref',
  'n-suf',
  'num',
  'pn',
  'pref',
  'prt',
  'suf',
  'unc',
  'v1',
  'v1-s',
  'v2a-s',
  'v5aru',
  'v5b',
  'v5g',
  'v5k',
  'v5k-s',
  'v5m',
  'v5n',
  'v5r',
  'v5r-i',
  'v5s',
  'v5t',
  'v5u',
  'v5u-s',
  'vi',
  'vk',
  'vn',
  'vr',
  'vs',
  'vs-c',
  'vs-i',
  'vs-s',
  'vt',
  'vz',
]);

export const JmdictDialectSchema = z.enum(['bra', 'hob', 'ksb', 'ktb', 'kyb', 'kyu', 'osb', 'thb', 'tsug']);

export const JmdictMiscSchema = z.enum([
  'abbr',
  'arch',
  'chn',
  'col',
  'dated',
  'derog',
  'euph',
  'fam',
  'fem',
  'form',
  'hist',
  'hon',
  'hum',
  'id',
  'joc',
  'male',
  'net-sl',
  'obs',
  'on-mim',
  'person',
  'place',
  'poet',
  'pol',
  'proverb',
  'quote',
  'rare',
  'sens',
  'sl',
  'uk',
  'vulg',
  'yoji',
]);

export const JmdictGlossTypeSchema = z.enum(['explanation', 'figurative', 'literal', 'trademark']);

export const JmdictGlossSchema = z.object({
  lang: z.string(),
  gender: z.string().nullable().optional(),
  type: JmdictGlossTypeSchema.nullable().optional(),
  text: z.string(),
});

export const JmdictKanjiSchema = z.object({
  common: z.boolean(),
  text: z.string(),
  tags: z.array(JmdictKanjiTagSchema),
});

export const JmdictKanaSchema = z.object({
  common: z.boolean(),
  text: z.string(),
  tags: z.array(JmdictKanaTagSchema),
  appliesToKanji: z.array(z.string()),
});

export const JmdictSenseSchema = z.object({
  partOfSpeech: z.array(JmdictPartOfSpeechSchema),
  appliesToKanji: z.array(z.string()),
  appliesToKana: z.array(z.string()),
  related: z.array(z.any()),
  antonym: z.array(z.any()),
  field: z.array(z.string()),
  dialect: z.array(JmdictDialectSchema),
  misc: z.array(JmdictMiscSchema),
  info: z.array(z.string()),
  languageSource: z.array(z.any()),
  gloss: z.array(JmdictGlossSchema),
});

export const JmdictEntrySchema = z.object({
  id: z.string(),
  kanji: z.array(JmdictKanjiSchema),
  kana: z.array(JmdictKanaSchema),
  sense: z.array(JmdictSenseSchema),
});

export type JmdictKanjiTag = z.infer<typeof JmdictKanjiTagSchema>;
export type JmdictKanaTag = z.infer<typeof JmdictKanaTagSchema>;
export type JmdictPartOfSpeech = z.infer<typeof JmdictPartOfSpeechSchema>;
export type JmdictDialect = z.infer<typeof JmdictDialectSchema>;
export type JmdictMisc = z.infer<typeof JmdictMiscSchema>;
export type JmdictGlossType = z.infer<typeof JmdictGlossTypeSchema>;

export type JmdictGloss = z.infer<typeof JmdictGlossSchema>;
export type JmdictKanji = z.infer<typeof JmdictKanjiSchema>;
export type JmdictKana = z.infer<typeof JmdictKanaSchema>;
export type JmdictSense = z.infer<typeof JmdictSenseSchema>;
export type JmdictEntry = z.infer<typeof JmdictEntrySchema>;

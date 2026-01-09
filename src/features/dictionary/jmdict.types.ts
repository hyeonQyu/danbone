import z from 'zod';

export const JmdictGlossSchema = z.object({
  lang: z.string(),
  gender: z.string().nullable(),
  type: z.string().nullable(),
  text: z.string(),
});

export const JmdictKanjiSchema = z.object({
  common: z.boolean(),
  text: z.string(),
  tags: z.array(z.string()),
});

export const JmdictKanaSchema = z.object({
  common: z.boolean(),
  text: z.string(),
  tags: z.array(z.string()),
  appliesToKanji: z.array(z.string()),
});

export const JmdictSenseSchema = z.object({
  partOfSpeech: z.array(z.string()),
  appliesToKanji: z.array(z.string()),
  appliesToKana: z.array(z.string()),
  related: z.array(z.any()),
  antonym: z.array(z.any()),
  field: z.array(z.string()),
  dialect: z.array(z.string()),
  misc: z.array(z.string()),
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

export type JmdictGloss = z.infer<typeof JmdictGlossSchema>;
export type JmdictKanji = z.infer<typeof JmdictKanjiSchema>;
export type JmdictKana = z.infer<typeof JmdictKanaSchema>;
export type JmdictSense = z.infer<typeof JmdictSenseSchema>;
export type JmdictEntry = z.infer<typeof JmdictEntrySchema>;

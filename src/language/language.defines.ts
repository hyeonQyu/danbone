import z from 'zod';

export const LANGUAGES = ['ko', 'ja'] as const;

export const LanguageSchema = z.enum(LANGUAGES);

export type Language = (typeof LANGUAGES)[number];
export type SourceLanguage = Extract<Language, 'ko'>;
export type TargetLanguage = Extract<Language, 'ja'>;

import { LANGUAGES } from '@/language/language.constants';
import z from 'zod';

export const LanguageSchema = z.enum(LANGUAGES);

export type Language = (typeof LANGUAGES)[number];
export type SourceLanguage = Extract<Language, 'ko'>;
export type TargetLanguage = Extract<Language, 'ja'>;

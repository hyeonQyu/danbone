import { LANGUAGES } from '@/language/language.constants';

export type Language = (typeof LANGUAGES)[number];
export type SourceLanguage = Extract<Language, 'ko'>;
export type TargetLanguage = Extract<Language, 'ja'>;

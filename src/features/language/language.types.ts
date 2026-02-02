export type Language = 'ko' | 'ja';
export type SourceLanguage = Extract<Language, 'ko'>;
export type TargetLanguage = Extract<Language, 'ja'>;

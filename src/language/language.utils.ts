import { Language } from '@/language/language.defines';

const LABEL_BY_LANGUAGE: Record<Language, string> = {
  ko: '한국어',
  ja: '일본어',
};

export const getLanguageLabel = (language: Language) => {
  return LABEL_BY_LANGUAGE[language];
};

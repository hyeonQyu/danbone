import { Language } from '@/language/language.types';

const labelByLanguage: Record<Language, string> = {
  ko: '한국어',
  ja: '일본어',
};

export const useGetLanguageLabel = () => {
  return (language: Language) => {
    return labelByLanguage[language];
  };
};

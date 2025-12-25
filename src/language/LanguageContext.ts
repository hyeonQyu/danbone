'use client';

import { SourceLanguage, TargetLanguage } from '@/language/language.types';
import { createContext, useContext } from 'react';

export const LanguageContext = createContext<
  | {
      sourceLanguage: SourceLanguage;
      targetLanguage: TargetLanguage;
      setSourceLanguage: (sourceLanguage: SourceLanguage) => void;
      setTargetLanguage: (targetLanguage: TargetLanguage) => void;
    }
  | undefined
>(undefined);

const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('LanguageContext를 사용하기 전에 LanguageProvider로 감싸주세요.');
  }
  return context;
};

export const useSourceLanguage = () => {
  const { sourceLanguage } = useLanguageContext();
  return sourceLanguage;
};

export const useTargetLanguage = () => {
  const { targetLanguage } = useLanguageContext();
  return targetLanguage;
};

export const useSetSourceLanguage = () => {
  const { setSourceLanguage } = useLanguageContext();
  return setSourceLanguage;
};

export const useSetTargetLanguage = () => {
  const { setTargetLanguage } = useLanguageContext();
  return setTargetLanguage;
};

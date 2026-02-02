'use client';

import { SourceLanguage, TargetLanguage } from '@/features/language/language.types';
import { LanguageContext } from '@/features/language/LanguageContext';
import { ReactNode, useMemo, useState } from 'react';

interface LanguageProviderProps {
  children: ReactNode;
}

function LanguageProvider({ children }: LanguageProviderProps) {
  const [sourceLanguage, setSourceLanguage] = useState<SourceLanguage>('ko');
  const [targetLanguage, setTargetLanguage] = useState<TargetLanguage>('ja');

  return (
    <LanguageContext.Provider
      value={useMemo(() => ({ sourceLanguage, targetLanguage, setSourceLanguage, setTargetLanguage }), [sourceLanguage, targetLanguage])}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export default LanguageProvider;

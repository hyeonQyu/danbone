import { useIndexedDBStore } from '@/indexed-db';
import { Language, useSourceLanguage, useTargetLanguage } from '@/language';
import { useEventCallback } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

export const useExploreQueryLanguage = () => {
  const sourceLanguage = useSourceLanguage();
  const targetLanguage = useTargetLanguage();

  const store = useIndexedDBStore('explore');
  const initializedRef = useRef(false);

  const [queryLanguage, setQueryLanguage] = useState<Language>(sourceLanguage);

  useEffect(() => {
    if (!store || initializedRef.current) return;
    initializedRef.current = true;

    store.get(targetLanguage).then((existingSettings) => {
      if (existingSettings) {
        setQueryLanguage(existingSettings.queryLanguage);
      } else {
        store.update(targetLanguage, {
          id: targetLanguage,
          queryLanguage: sourceLanguage,
        });
      }
    });
  }, [store, sourceLanguage, targetLanguage]);

  const handleChangeQueryLanguage = useEventCallback(async (language: Language) => {
    setQueryLanguage(language);
    await store?.update(targetLanguage, {
      id: targetLanguage,
      queryLanguage: language,
    });
  });

  return { queryLanguage, setQueryLanguage: handleChangeQueryLanguage };
};

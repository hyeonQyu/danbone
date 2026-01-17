import { getDictionaryEntryJA } from '@/features/dictionary/actions';
import { DICTIONARY_QUERY_KEY } from '@/features/dictionary/dictionary.queryKey';
import { DictionaryEntryByLanguage } from '@/features/dictionary/dictionary.types';
import { useSourceLanguage } from '@/language';
import { serverAction, TIME_UNIT } from '@/lib';
import { FetchQueryOptions } from '@tanstack/react-query';
import { useMemo } from 'react';

export const useDictionaryEntryJAFetchQueryOptions = (entryId: string): FetchQueryOptions<DictionaryEntryByLanguage['ja'] | null> => {
  const sourceLanguage = useSourceLanguage();

  return useMemo(() => {
    const entryQueryKey = DICTIONARY_QUERY_KEY.entry.get(entryId, sourceLanguage);
    const fetchDictionaryEntryJA = serverAction(() => getDictionaryEntryJA({ entryId, sourceLanguage }));

    return {
      queryKey: entryQueryKey,
      queryFn: fetchDictionaryEntryJA,
      staleTime: TIME_UNIT.unitOfMs.asMinute * 10,
      enabled: Boolean(entryId && sourceLanguage),
    };
  }, [entryId, sourceLanguage]);
};

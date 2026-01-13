import { SourceLanguage } from '@/language';

export const DICTIONARY_QUERY_KEY = {
  all: () => ['dictionary'] as const,
  entry: {
    all: () => [...DICTIONARY_QUERY_KEY.all(), 'entry'] as const,
    get: (id: string, sourceLanguage: SourceLanguage) => [...DICTIONARY_QUERY_KEY.entry.all(), id, sourceLanguage] as const,
  },
};

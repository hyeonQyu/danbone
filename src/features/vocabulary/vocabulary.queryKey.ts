import { TargetLanguage } from '@/language';

export const VOCABULARY_QUERY_KEY = {
  all: () => ['vocabulary'] as const,
  books: {
    all: () => [...VOCABULARY_QUERY_KEY.all(), 'books'] as const,
    get: (targetLanguage: TargetLanguage) => [...VOCABULARY_QUERY_KEY.books.all(), targetLanguage] as const,
  },
};

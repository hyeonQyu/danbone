export const MAX_ENTRIES_PER_BOOK = 100;

export const VOCABULARY_BOOK_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#FFA07A',
  '#98D8C8',
  '#F7DC6F',
  '#BB8FCE',
  '#85C1E2',
  '#F8B88B',
  '#AED6F1',
] as const;

export type VocabularyBookColor = (typeof VOCABULARY_BOOK_COLORS)[number];

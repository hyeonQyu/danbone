export const MAX_ENTRIES_PER_BOOK = 100;

export const VOCABULARY_BOOK_COLORS = [
  '#FF6B6B', // 코랄 레드
  '#4ECDC4', // 민트
  '#45B7D1', // 스카이 블루
  '#FFA07A', // 라이트 살몬
  '#C5E1A5', // 라이트 그린
  '#B0BEC5', // 블루 그레이
  '#BB8FCE', // 라벤더
  '#F48FB1', // 핑크
  '#FFD54F', // 앰버 골드
  '#90CAF9', // 밝은 블루
] as const;

export type VocabularyBookColor = (typeof VOCABULARY_BOOK_COLORS)[number];

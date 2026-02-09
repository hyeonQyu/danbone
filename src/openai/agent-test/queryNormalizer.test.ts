import { LocalizedTextSchema } from '@/openai/schemes';
import z from 'zod';
import { TestCase } from './agent.test.types';

type LocalizedText = z.infer<typeof LocalizedTextSchema>;

type QueryNormalizerTestCase = Omit<TestCase<LocalizedText>, 'input'> & {
  input: LocalizedText;
};

export const queryNormalizerTestCases: QueryNormalizerTestCase[] = [
  // ===== KOREAN - STANDARD (already normalized) =====
  {
    input: { language: 'ko', text: '안녕하세요' },
    expectedOutput: { language: 'ko', text: '안녕하세요' },
    description: '한국어 표준어 단어 - 이미 정규화됨',
  },
  {
    input: { language: 'ko', text: '오늘 날씨가 좋네요' },
    expectedOutput: { language: 'ko', text: '오늘 날씨가 좋네요' },
    description: '한국어 표준어 문장 - 이미 정규화됨',
  },
  {
    input: { language: 'ko', text: '좋은 아침입니다' },
    expectedOutput: { language: 'ko', text: '좋은 아침입니다' },
    description: '한국어 표준어 구 - 이미 정규화됨',
  },

  // ===== KOREAN - NON-STANDARD (needs normalization) =====
  {
    input: { language: 'ko', text: '안녕하세용' },
    expectedOutput: { language: 'ko', text: '안녕하세요' },
    description: '한국어 비표준 종결어미 정규화',
  },
  {
    input: { language: 'ko', text: '고마워용' },
    expectedOutput: { language: 'ko', text: '고마워요' },
    description: '한국어 비표준 종결어미 정규화',
  },
  {
    input: { language: 'ko', text: '오늘 날씨 좋넹' },
    expectedOutput: { language: 'ko', text: '오늘 날씨 좋네' },
    description: '한국어 비표준 문장 정규화',
  },
  {
    input: { language: 'ko', text: '이게모지' },
    expectedOutput: { language: 'ko', text: '이게 뭐지' },
    description: '한국어 띄어쓰기 오류 수정',
  },
  {
    input: { language: 'ko', text: '진짜루?' },
    expectedOutput: { language: 'ko', text: '진짜로?' },
    description: '한국어 비표준 표현 정규화',
  },
  {
    input: { language: 'ko', text: '머선129' },
    expectedOutput: { language: 'ko', text: '무슨 일' },
    description: '한국어 인터넷 신조어 정규화',
  },
  {
    input: { language: 'ko', text: '안녕하새요' },
    expectedOutput: { language: 'ko', text: '안녕하세요' },
    description: '한국어 오타 수정',
  },

  // ===== JAPANESE - STANDARD (already normalized) =====
  {
    input: { language: 'ja', text: 'ありがとう' },
    expectedOutput: { language: 'ja', text: 'ありがとう' },
    description: '일본어 표준 히라가나 - 이미 정규화됨',
  },
  {
    input: { language: 'ja', text: '今日はいい天気ですね' },
    expectedOutput: { language: 'ja', text: '今日はいい天気ですね' },
    description: '일본어 표준 문장 - 이미 정규화됨',
  },
  {
    input: { language: 'ja', text: 'ラーメン' },
    expectedOutput: { language: 'ja', text: 'ラーメン' },
    description: '일본어 카타카나 - 이미 정규화됨',
  },
  {
    input: { language: 'ja', text: '寿司' },
    expectedOutput: { language: 'ja', text: '寿司' },
    description: '일본어 한자 - 이미 정규화됨',
  },

  // ===== JAPANESE - NON-STANDARD (needs normalization) =====
  {
    input: { language: 'ja', text: 'こんにちわ' },
    expectedOutput: { language: 'ja', text: 'こんにちは' },
    description: '일본어 흔한 오타 수정 (わ→は)',
  },
  {
    input: { language: 'ja', text: 'おはよー' },
    expectedOutput: { language: 'ja', text: 'おはよう' },
    description: '일본어 장음 비표준 표기 정규화',
  },
  {
    input: { language: 'ja', text: 'ありがとぉ' },
    expectedOutput: { language: 'ja', text: 'ありがとう' },
    description: '일본어 비표준 장음 정규화',
  },
  {
    input: { language: 'ja', text: 'すごーい' },
    expectedOutput: { language: 'ja', text: 'すごい' },
    description: '일본어 장음 비표준 표기 정규화',
  },

  // ===== JAPANESE - LANGUAGE MISMATCH (wrong script/language) =====
  {
    input: { language: 'ja', text: '타베루' },
    expectedOutput: { language: 'ja', text: 'たべる' },
    description: '일본어 선택, 한글 표기 → 히라가나로 변환',
  },
  {
    input: { language: 'ja', text: '아리가또' },
    expectedOutput: { language: 'ja', text: 'ありがとう' },
    description: '일본어 선택, 한글 표기 → 히라가나로 변환',
  },
  {
    input: { language: 'ja', text: 'arigato' },
    expectedOutput: { language: 'ja', text: 'ありがとう' },
    description: '일본어 선택, 로마자 표기 → 히라가나로 변환',
  },
  {
    input: { language: 'ja', text: 'konnichiwa' },
    expectedOutput: { language: 'ja', text: 'こんにちは' },
    description: '일본어 선택, 로마자 표기 → 히라가나로 변환',
  },
  {
    input: { language: 'ja', text: '라멘' },
    expectedOutput: { language: 'ja', text: 'ラーメン' },
    description: '일본어 선택, 한글 표기 → 카타카나로 변환',
  },

  // ===== MIXED CASES - Sentences with multiple issues =====
  {
    input: { language: 'ko', text: '오늘날씨진짜좋넹' },
    expectedOutput: { language: 'ko', text: '오늘 날씨 진짜 좋네' },
    description: '한국어 띄어쓰기 + 비표준어 복합 정규화',
  },
  {
    input: { language: 'ko', text: '고마워용 진짜루' },
    expectedOutput: { language: 'ko', text: '고마워요 진짜로' },
    description: '한국어 여러 비표준 표현 정규화',
  },
  {
    input: { language: 'ja', text: 'ほんとにすごーい' },
    expectedOutput: { language: 'ja', text: 'ほんとにすごい' },
    description: '일본어 문장 내 비표준 표현 정규화',
  },

  // ===== EDGE CASES =====
  {
    input: { language: 'ko', text: '대박' },
    expectedOutput: { language: 'ko', text: '대박' },
    description: '한국어 속어지만 일반적으로 사용 - 유지',
  },
  {
    input: { language: 'ko', text: '헐' },
    expectedOutput: { language: 'ko', text: '헐' },
    description: '한국어 감탄사 - 유지',
  },
  {
    input: { language: 'ja', text: 'やばい' },
    expectedOutput: { language: 'ja', text: 'やばい' },
    description: '일본어 속어지만 일반적으로 사용 - 유지',
  },
];

import { queryClassifierOutputSchema } from '@/openai/schemes';
import z from 'zod';
import { TestCase } from './agent.test.types';

type QueryClassifierOutput = z.infer<typeof queryClassifierOutputSchema>;

export const queryClassifierTestCases: TestCase<QueryClassifierOutput>[] = [
  {
    input: '스시',
    expectedOutput: {
      unit: 'word',
      lang: 'ja_kor_input',
      text: '寿司',
    },
    description: '한글로 쓴 일본어 단어 - 스시',
  },
  {
    input: '오마카세',
    expectedOutput: {
      unit: 'word',
      lang: 'ja_kor_input',
      text: 'おまかせ',
    },
    description: '한글로 쓴 일본어 단어 - 오마카세',
  },
  {
    input: '라멘',
    expectedOutput: {
      unit: 'word',
      lang: 'ja_kor_input',
      text: 'ラーメン',
    },
    description: '한글로 쓴 일본어 단어 - 라멘',
  },
  {
    input: '오늘 날씨가 좋네요',
    expectedOutput: {
      unit: 'sentence',
      lang: 'ko',
      text: '오늘 날씨가 좋네요',
    },
    description: '한국어 문장',
  },
  {
    input: '김치',
    expectedOutput: {
      unit: 'word',
      lang: 'ko',
      text: '김치',
    },
    description: '한국어 단어',
  },
  {
    input: 'おはよう',
    expectedOutput: {
      unit: 'word',
      lang: 'ja',
      text: 'おはよう',
    },
    description: '일본어 히라가나',
  },
  {
    input: 'ラーメン',
    expectedOutput: {
      unit: 'word',
      lang: 'ja',
      text: 'ラーメン',
    },
    description: '일본어 카타카나',
  },
  {
    input: '今日はいい天気ですね',
    expectedOutput: {
      unit: 'sentence',
      lang: 'ja',
      text: '今日はいい天気ですね',
    },
    description: '일본어 문장',
  },
];

import { guardrailOutputSchema } from '@/openai/schemes';
import z from 'zod';
import { TestCase } from './agent.test.types';

type GuardrailOutput = z.infer<typeof guardrailOutputSchema>;

export const searchInputGuardrailTestCases: TestCase<GuardrailOutput>[] = [
  // ===== VALID CASES (Korean) =====
  {
    input: '안녕하세요',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: '오늘 날씨가 좋네요',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: '학교에서 친구들과 놀아요',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: '대한민국 서울시',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: '김치찌개 레시피',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: '서울 맛집 추천',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: '파이썬 배우기',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: '강아지 키우는 법',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: '안녕하세욧',
    expectedOutput: {
      valid: true,
    },
  },

  // ===== VALID CASES (Japanese) =====
  {
    input: 'こんにちは',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: 'カタカナです',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: '日本語を勉強します',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: 'ひらがなとカタカナ',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: '東京 観光',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: '寿司 作り方',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: 'アニメ おすすめ',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: '渋谷 カフェ',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: 'こんにちわ',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: 'おはよー',
    expectedOutput: {
      valid: true,
    },
  },

  // ===== VALID CASES (English) =====
  {
    input: 'Hello world',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: 'Good morning!',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: 'How are you today?',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: 'Learning English 123',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: 'Python tutorial',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: 'best sushi restaurant',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: 'how to learn Japanese',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: 'thnak you',
    expectedOutput: {
      valid: true,
    },
  },

  // ===== VALID CASES (Japanese in Hangul) =====
  {
    input: '아리가또',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: '곤니찌와',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: '사요나라',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: '고멘나사이',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: '오하요',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: '스고이',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: '가와이',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: '라멘 맛집',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: '스시 종류',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: '오니기리 만들기',
    expectedOutput: {
      valid: true,
    },
  },

  // ===== VALID CASES (Japanese Kanji Only) =====
  {
    input: '日本',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: '学校',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: '勉強',
    expectedOutput: {
      valid: true,
    },
  },

  // ===== INVALID CASES (Chinese) =====
  {
    input: '你好',
    expectedOutput: {
      valid: false,
    },
  },
  {
    input: '谢谢',
    expectedOutput: {
      valid: false,
    },
  },
  {
    input: '早上好',
    expectedOutput: {
      valid: false,
    },
  },
  {
    input: '北京烤鸭',
    expectedOutput: {
      valid: false,
    },
  },
  {
    input: '学习中文',
    expectedOutput: {
      valid: false,
    },
  },
  {
    input: '你好吗',
    expectedOutput: {
      valid: false,
    },
  },

  // ===== INVALID CASES (European Languages) =====
  {
    input: 'Bonjour',
    expectedOutput: {
      valid: false,
    },
  },
  {
    input: 'Guten Tag',
    expectedOutput: {
      valid: false,
    },
  },
  {
    input: 'Hola amigo',
    expectedOutput: {
      valid: false,
    },
  },
  {
    input: 'Ciao bella',
    expectedOutput: {
      valid: false,
    },
  },

  // ===== INVALID CASES (Other Languages) =====
  {
    input: 'Привет',
    expectedOutput: {
      valid: false,
    },
  },
  {
    input: 'مرحبا',
    expectedOutput: {
      valid: false,
    },
  },
  {
    input: 'สวัสดี',
    expectedOutput: {
      valid: false,
    },
  },

  // ===== INVALID CASES (Other Languages in Hangul) =====
  {
    input: '니하오',
    expectedOutput: {
      valid: false,
    },
  },
  {
    input: '봉주르',
    expectedOutput: {
      valid: false,
    },
  },
  {
    input: '메르시',
    expectedOutput: {
      valid: false,
    },
  },
  {
    input: '시에시에',
    expectedOutput: {
      valid: false,
    },
  },

  // ===== INVALID CASES (Fake Japanese-like) =====
  {
    input: 'ぎゃらぷす',
    expectedOutput: {
      valid: false,
    },
  },
  {
    input: 'カタガナバボ',
    expectedOutput: {
      valid: false,
    },
  },

  // ===== INVALID CASES (Mixed/Edge Cases) =====
  {
    input: '안녕 你好',
    expectedOutput: {
      valid: false,
    },
  },
  {
    input: 'Hello مرحبا',
    expectedOutput: {
      valid: false,
    },
  },
  {
    input: '',
    expectedOutput: {
      valid: false,
    },
  },

  {
    input: '보쿠와 카이조쿠오니 나루 오토코다',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: '도우시탄데스까?',
    expectedOutput: {
      valid: true,
    },
  },
];

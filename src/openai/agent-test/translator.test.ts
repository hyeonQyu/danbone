import { localizedTextsSchema, translationSourceSchema } from '@/openai/schemes';
import z from 'zod';
import { TestCase } from './agent.test.types';

type TranslationInput = z.infer<typeof translationSourceSchema>;
type TranslationOutput = z.infer<typeof localizedTextsSchema>;

type TranslatorTestCase = Omit<TestCase<TranslationOutput>, 'input'> & {
  input: TranslationInput;
};

export const translatorTestCases: TranslatorTestCase[] = [
  // ===== 한국어 → 일본어: 단어 - 단일 의미 =====
  {
    input: { text: '물', sourceLanguage: 'ko', targetLanguage: 'ja' },
    expectedOutput: { language: 'ja', texts: ['水'] },
    description: '한→일: 단일 의미 단어 - 물',
  },
  {
    input: { text: '책', sourceLanguage: 'ko', targetLanguage: 'ja' },
    expectedOutput: { language: 'ja', texts: ['本'] },
    description: '한→일: 단일 의미 단어 - 책',
  },
  {
    input: { text: '나무', sourceLanguage: 'ko', targetLanguage: 'ja' },
    expectedOutput: { language: 'ja', texts: ['木'] },
    description: '한→일: 단일 의미 단어 - 나무',
  },

  // ===== 한국어 → 일본어: 단어 - 복수 의미 =====
  {
    input: { text: '사과', sourceLanguage: 'ko', targetLanguage: 'ja' },
    expectedOutput: { language: 'ja', texts: ['りんご', '謝罪', 'お詫び'] },
    description: '한→일: 복수 의미 단어 - 사과 (과일/사죄)',
  },
  {
    input: { text: '조금', sourceLanguage: 'ko', targetLanguage: 'ja' },
    expectedOutput: { language: 'ja', texts: ['少し', 'ちょっと'] },
    description: '한→일: 복수 의미 단어 - 조금 (격식/캐주얼)',
  },
  {
    input: { text: '있다', sourceLanguage: 'ko', targetLanguage: 'ja' },
    expectedOutput: { language: 'ja', texts: ['ある', 'いる'] },
    description: '한→일: 복수 의미 단어 - 있다 (무생물/생물)',
  },
  {
    input: { text: '좋다', sourceLanguage: 'ko', targetLanguage: 'ja' },
    expectedOutput: { language: 'ja', texts: ['いい', 'よい', '好き'] },
    description: '한→일: 복수 의미 단어 - 좋다 (캐주얼/격식/선호)',
  },
  {
    input: { text: '먹다', sourceLanguage: 'ko', targetLanguage: 'ja' },
    expectedOutput: { language: 'ja', texts: ['食べる'] },
    description: '한→일: 단일 의미 동사 - 먹다',
  },
  {
    input: { text: '보다', sourceLanguage: 'ko', targetLanguage: 'ja' },
    expectedOutput: { language: 'ja', texts: ['見る', '観る'] },
    description: '한→일: 복수 의미 동사 - 보다 (보다/관람하다)',
  },

  // ===== 한국어 → 일본어: 문장 - 단일 번역 =====
  {
    input: { text: '안녕하세요', sourceLanguage: 'ko', targetLanguage: 'ja' },
    expectedOutput: { language: 'ja', texts: ['こんにちは'] },
    description: '한→일: 표준 인사 - 안녕하세요',
  },
  {
    input: { text: '감사합니다', sourceLanguage: 'ko', targetLanguage: 'ja' },
    expectedOutput: { language: 'ja', texts: ['ありがとうございます'] },
    description: '한→일: 정중한 감사 표현',
  },
  {
    input: { text: '죄송합니다', sourceLanguage: 'ko', targetLanguage: 'ja' },
    expectedOutput: { language: 'ja', texts: ['すみません', '申し訳ございません'] },
    description: '한→일: 사과 표현 (일반/격식)',
  },

  // ===== 한국어 → 일본어: 문장 - 복수 번역 =====
  {
    input: { text: '정말 고마워', sourceLanguage: 'ko', targetLanguage: 'ja' },
    expectedOutput: { language: 'ja', texts: ['本当にありがとう', 'どうもありがとう'] },
    description: '한→일: 반말 감사 표현 (복수 변형)',
  },
  {
    input: { text: '정말 고마워요', sourceLanguage: 'ko', targetLanguage: 'ja' },
    expectedOutput: { language: 'ja', texts: ['本当にありがとうございます', 'どうもありがとうございます'] },
    description: '한→일: 존댓말 감사 표현 (복수 변형)',
  },
  {
    input: { text: '괜찮아요', sourceLanguage: 'ko', targetLanguage: 'ja' },
    expectedOutput: { language: 'ja', texts: ['大丈夫です', '平気です'] },
    description: '한→일: 괜찮다는 표현 (존댓말)',
  },
  {
    input: { text: '잘 지냈어요?', sourceLanguage: 'ko', targetLanguage: 'ja' },
    expectedOutput: { language: 'ja', texts: ['元気でしたか', 'お元気でしたか'] },
    description: '한→일: 안부 인사 (격식 차이)',
  },

  // ===== 한국어 → 일본어: 구/절 =====
  {
    input: { text: '오늘 날씨', sourceLanguage: 'ko', targetLanguage: 'ja' },
    expectedOutput: { language: 'ja', texts: ['今日の天気', '本日の天気'] },
    description: '한→일: 구 - 오늘 날씨 (일반/격식)',
  },
  {
    input: { text: '맛있는 음식', sourceLanguage: 'ko', targetLanguage: 'ja' },
    expectedOutput: { language: 'ja', texts: ['美味しい料理', '美味しい食べ物'] },
    description: '한→일: 구 - 맛있는 음식',
  },

  // ===== 일본어 → 한국어: 단어 - 단일 의미 =====
  {
    input: { text: 'ねこ', sourceLanguage: 'ja', targetLanguage: 'ko' },
    expectedOutput: { language: 'ko', texts: ['고양이'] },
    description: '일→한: 단일 의미 단어 - 고양이',
  },
  {
    input: { text: '犬', sourceLanguage: 'ja', targetLanguage: 'ko' },
    expectedOutput: { language: 'ko', texts: ['개'] },
    description: '일→한: 단일 의미 단어 - 개',
  },

  // ===== 일본어 → 한국어: 단어 - 반말 =====
  {
    input: { text: 'ありがとう', sourceLanguage: 'ja', targetLanguage: 'ko' },
    expectedOutput: { language: 'ko', texts: ['고마워'] },
    description: '일→한: 반말 - 고마워 (캐주얼)',
  },
  {
    input: { text: 'こんにちは', sourceLanguage: 'ja', targetLanguage: 'ko' },
    expectedOutput: { language: 'ko', texts: ['안녕하세요'] },
    description: '일→한: 표준 인사',
  },
  {
    input: { text: 'すみません', sourceLanguage: 'ja', targetLanguage: 'ko' },
    expectedOutput: { language: 'ko', texts: ['죄송합니다', '실례합니다', '저기요'] },
    description: '일→한: 복수 의미 - 미안/실례/호칭',
  },
  {
    input: { text: 'いい', sourceLanguage: 'ja', targetLanguage: 'ko' },
    expectedOutput: { language: 'ko', texts: ['좋다', '괜찮다'] },
    description: '일→한: 복수 의미 - 좋다/괜찮다',
  },

  // ===== 일본어 → 한국어: 문장 - 격식 차이 =====
  {
    input: { text: 'おはよう', sourceLanguage: 'ja', targetLanguage: 'ko' },
    expectedOutput: { language: 'ko', texts: ['좋은 아침', '안녕'] },
    description: '일→한: 아침 인사 (캐주얼)',
  },
  {
    input: { text: 'おはようございます', sourceLanguage: 'ja', targetLanguage: 'ko' },
    expectedOutput: { language: 'ko', texts: ['좋은 아침입니다', '안녕하세요'] },
    description: '일→한: 아침 인사 (정중)',
  },

  // ===== 일본어 → 한국어: 문장 - 복수 번역 =====
  {
    input: { text: 'どうぞ', sourceLanguage: 'ja', targetLanguage: 'ko' },
    expectedOutput: { language: 'ko', texts: ['어서 오세요', '드세요', '받으세요', '여기요'] },
    description: '일→한: 상황별 복수 의미 - 권유 표현 (존댓말)',
  },
  {
    input: { text: 'お疲れ様です', sourceLanguage: 'ja', targetLanguage: 'ko' },
    expectedOutput: { language: 'ko', texts: ['수고하셨습니다', '고생하셨습니다'] },
    description: '일→한: 격려/인사 표현',
  },

  // ===== 일본어 → 한국어: 구/절 =====
  {
    input: { text: '今日の天気', sourceLanguage: 'ja', targetLanguage: 'ko' },
    expectedOutput: { language: 'ko', texts: ['오늘 날씨', '오늘의 날씨'] },
    description: '일→한: 구 - 오늘 날씨',
  },
  {
    input: { text: '美味しい料理', sourceLanguage: 'ja', targetLanguage: 'ko' },
    expectedOutput: { language: 'ko', texts: ['맛있는 요리', '맛있는 음식'] },
    description: '일→한: 구 - 맛있는 요리',
  },

  // ===== 에지 케이스: 짧은 표현 =====
  {
    input: { text: 'はい', sourceLanguage: 'ja', targetLanguage: 'ko' },
    expectedOutput: { language: 'ko', texts: ['네', '예'] },
    description: '일→한: 짧은 긍정 표현',
  },
  {
    input: { text: '네', sourceLanguage: 'ko', targetLanguage: 'ja' },
    expectedOutput: { language: 'ja', texts: ['はい'] },
    description: '한→일: 짧은 긍정 표현',
  },

  // ===== 한국어 → 일본어: 격식 차이 명확한 케이스 =====
  {
    input: { text: '고마워', sourceLanguage: 'ko', targetLanguage: 'ja' },
    expectedOutput: { language: 'ja', texts: ['ありがとう'] },
    description: '한→일: 반말 감사 표현',
  },
  {
    input: { text: '고마워요', sourceLanguage: 'ko', targetLanguage: 'ja' },
    expectedOutput: { language: 'ja', texts: ['ありがとうございます'] },
    description: '한→일: 존댓말 감사 표현',
  },
  {
    input: { text: '미안해', sourceLanguage: 'ko', targetLanguage: 'ja' },
    expectedOutput: { language: 'ja', texts: ['ごめん'] },
    description: '한→일: 반말 사과',
  },
  {
    input: { text: '미안해요', sourceLanguage: 'ko', targetLanguage: 'ja' },
    expectedOutput: { language: 'ja', texts: ['ごめんなさい', 'すみません'] },
    description: '한→일: 존댓말 사과',
  },

  // ===== 일본어 → 한국어: 격식 차이 명확한 케이스 =====
  {
    input: { text: 'ありがとうございます', sourceLanguage: 'ja', targetLanguage: 'ko' },
    expectedOutput: { language: 'ko', texts: ['고마워요', '감사합니다'] },
    description: '일→한: 존댓말 감사 표현',
  },
  {
    input: { text: 'ごめん', sourceLanguage: 'ja', targetLanguage: 'ko' },
    expectedOutput: { language: 'ko', texts: ['미안해'] },
    description: '일→한: 반말 사과',
  },
  {
    input: { text: 'ごめんなさい', sourceLanguage: 'ja', targetLanguage: 'ko' },
    expectedOutput: { language: 'ko', texts: ['미안해요'] },
    description: '일→한: 존댓말 사과 (중간 격식)',
  },
  {
    input: { text: 'すみません', sourceLanguage: 'ja', targetLanguage: 'ko' },
    expectedOutput: { language: 'ko', texts: ['죄송합니다', '미안합니다'] },
    description: '일→한: 존댓말 사과 (정중)',
  },
];

import { localizedTextSchema, validatorSchema } from '@/openai/schemes';
import z from 'zod';
import { TestCase } from './agent.test.types';

type ValidatorInput = z.infer<typeof localizedTextSchema>;
type ValidatorOutput = z.infer<typeof validatorSchema>;

type InputValidatorTestCase = Omit<TestCase<ValidatorOutput>, 'input'> & {
  input: ValidatorInput;
};

export const inputValidatorTestCases: InputValidatorTestCase[] = [
  // ===== VALID CASES - Korean (ko) =====
  {
    input: { language: 'ko', text: '안녕하세요' },
    expectedOutput: { valid: true },
    description: '한국어 표준 인사',
  },
  {
    input: { language: 'ko', text: '안녕하세용' },
    expectedOutput: { valid: true },
    description: '한국어 비표준어 (실제 사용)',
  },
  {
    input: { language: 'ko', text: '오늘 날씨가 좋네욧' },
    expectedOutput: { valid: true },
    description: '한국어 문장 비표준 종결어미',
  },
  {
    input: { language: 'ko', text: '고맙습니당' },
    expectedOutput: { valid: true },
    description: '한국어 비표준 종결어미',
  },
  {
    input: { language: 'ko', text: '감사해욥' },
    expectedOutput: { valid: true },
    description: '한국어 비표준 종결어미',
  },
  {
    input: { language: 'ko', text: '밥 먹었어?' },
    expectedOutput: { valid: true },
    description: '한국어 구어체',
  },
  {
    input: { language: 'ko', text: '대박' },
    expectedOutput: { valid: true },
    description: '한국어 감탄사',
  },
  {
    input: { language: 'ko', text: '헐' },
    expectedOutput: { valid: true },
    description: '한국어 감탄사',
  },
  {
    input: { language: 'ko', text: '짱' },
    expectedOutput: { valid: true },
    description: '한국어 속어',
  },
  {
    input: { language: 'ko', text: '멋지다' },
    expectedOutput: { valid: true },
    description: '한국어 형용사',
  },

  // ===== VALID CASES - Japanese (ja) in Japanese scripts =====
  {
    input: { language: 'ja', text: 'ありがとう' },
    expectedOutput: { valid: true },
    description: '일본어 히라가나',
  },
  {
    input: { language: 'ja', text: 'ありがとぉ' },
    expectedOutput: { valid: true },
    description: '일본어 비표준 표기 (실제 사용)',
  },
  {
    input: { language: 'ja', text: 'こんにちわ' },
    expectedOutput: { valid: true },
    description: '일본어 흔한 오타 (は→わ)',
  },
  {
    input: { language: 'ja', text: 'おはよー' },
    expectedOutput: { valid: true },
    description: '일본어 장음 비표준 표기',
  },
  {
    input: { language: 'ja', text: 'すごーい' },
    expectedOutput: { valid: true },
    description: '일본어 장음 비표준 표기',
  },
  {
    input: { language: 'ja', text: 'カタカナ' },
    expectedOutput: { valid: true },
    description: '일본어 카타카나',
  },
  {
    input: { language: 'ja', text: '寿司' },
    expectedOutput: { valid: true },
    description: '일본어 한자',
  },
  {
    input: { language: 'ja', text: '渋谷 カフェ' },
    expectedOutput: { valid: true },
    description: '일본어 한자+카타카나',
  },
  {
    input: { language: 'ja', text: '今日はいい天気ですね' },
    expectedOutput: { valid: true },
    description: '일본어 문장',
  },

  // ===== VALID CASES - Japanese (ja) in Hangul =====
  {
    input: { language: 'ja', text: '아리가또' },
    expectedOutput: { valid: true },
    description: '일본어를 한글로 표기 - ありがとう',
  },
  {
    input: { language: 'ja', text: '아리가또오' },
    expectedOutput: { valid: true },
    description: '일본어를 한글로 표기 (장음)',
  },
  {
    input: { language: 'ja', text: '곤니찌와' },
    expectedOutput: { valid: true },
    description: '일본어를 한글로 표기 - こんにちは',
  },
  {
    input: { language: 'ja', text: '사요나라' },
    expectedOutput: { valid: true },
    description: '일본어를 한글로 표기 - さようなら',
  },
  {
    input: { language: 'ja', text: '오하요' },
    expectedOutput: { valid: true },
    description: '일본어를 한글로 표기 - おはよう',
  },
  {
    input: { language: 'ja', text: '스시' },
    expectedOutput: { valid: true },
    description: '일본어를 한글로 표기 - すし',
  },
  {
    input: { language: 'ja', text: '라멘' },
    expectedOutput: { valid: true },
    description: '일본어를 한글로 표기 - ラーメン',
  },
  {
    input: { language: 'ja', text: '오마카세' },
    expectedOutput: { valid: true },
    description: '일본어를 한글로 표기 - おまかせ',
  },
  {
    input: { language: 'ja', text: '가와이' },
    expectedOutput: { valid: true },
    description: '일본어를 한글로 표기 - かわいい',
  },
  {
    input: { language: 'ja', text: '스고이' },
    expectedOutput: { valid: true },
    description: '일본어를 한글로 표기 - すごい',
  },

  // ===== VALID CASES - Japanese (ja) in Latin =====
  {
    input: { language: 'ja', text: 'arigato' },
    expectedOutput: { valid: true },
    description: '일본어를 로마자로 표기',
  },
  {
    input: { language: 'ja', text: 'konnichiwa' },
    expectedOutput: { valid: true },
    description: '일본어를 로마자로 표기',
  },
  {
    input: { language: 'ja', text: 'kawaii' },
    expectedOutput: { valid: true },
    description: '일본어를 로마자로 표기',
  },

  // ===== INVALID CASES - Wrong language vocabulary =====
  {
    input: { language: 'ko', text: '아리가또' },
    expectedOutput: { valid: false },
    description: 'INVALID: 한국어 선택, 일본어 어휘',
  },
  {
    input: { language: 'ko', text: 'ありがとう' },
    expectedOutput: { valid: false },
    description: 'INVALID: 한국어 선택, 일본어 어휘',
  },
  {
    input: { language: 'ko', text: '곤니찌와' },
    expectedOutput: { valid: false },
    description: 'INVALID: 한국어 선택, 일본어 어휘',
  },
  {
    input: { language: 'ko', text: '스시' },
    expectedOutput: { valid: false },
    description: 'INVALID: 한국어 선택, 일본어 어휘',
  },
  {
    input: { language: 'ko', text: '니하오' },
    expectedOutput: { valid: false },
    description: 'INVALID: 한국어 선택, 중국어 어휘',
  },
  {
    input: { language: 'ja', text: '안녕하세요' },
    expectedOutput: { valid: false },
    description: 'INVALID: 일본어 선택, 한국어 어휘',
  },
  {
    input: { language: 'ja', text: '감사합니다' },
    expectedOutput: { valid: false },
    description: 'INVALID: 일본어 선택, 한국어 어휘',
  },
  {
    input: { language: 'ja', text: '你好' },
    expectedOutput: { valid: false },
    description: 'INVALID: 일본어 선택, 중국어 어휘',
  },
  // ===== INVALID CASES - Gibberish/meaningless =====
  {
    input: { language: 'ko', text: 'ㅁㄴㅇㄹ' },
    expectedOutput: { valid: false },
    description: 'INVALID: 무의미한 자음 조합',
  },
  {
    input: { language: 'ko', text: 'ㅋㅋㅋㅋㅋ' },
    expectedOutput: { valid: false },
    description: 'INVALID: 웃음 표현 (단어/문장 아님)',
  },
  {
    input: { language: 'ja', text: 'ぎゃらぷす' },
    expectedOutput: { valid: false },
    description: 'INVALID: 가짜 일본어',
  },
  {
    input: { language: 'ja', text: 'カタガナバボ' },
    expectedOutput: { valid: false },
    description: 'INVALID: 무의미한 카타카나',
  },
];

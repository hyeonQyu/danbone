import { guardrailOutputSchema } from '@/openai/schemes';
import z from 'zod';
import { TestCase } from './agent.test.types';

type GuardrailOutput = z.infer<typeof guardrailOutputSchema>;

export const searchInputGuardrailTestCases: TestCase<GuardrailOutput>[] = [
  {
    input: '안녕하세요',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: '오늘 날씨가 좋네요.',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: '안녕하세요!',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: '이것이 궁금해요?',
    expectedOutput: {
      valid: true,
    },
  },
  {
    input: '첫 번째 문장. 두 번째 문장.',
    expectedOutput: {
      valid: false,
    },
  },
  {
    input: '하나. 둘. 셋.',
    expectedOutput: {
      valid: false,
    },
  },
];

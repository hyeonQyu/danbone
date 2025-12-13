import { buildAgentFactory } from '@/openai/agent.utils';
import { guardrailOutputSchema } from '@/openai/schemes';

export const searchInputGuardrailAgentFactory = buildAgentFactory(
  {
    name: 'Search input guardrail',
    outputType: guardrailOutputSchema,
  },
  {
    'gpt-5-nano': {
      instructions: `
      Validate if input contains ONE sentence or less.

      Sentence endings: period (.), exclamation mark (!), question mark (?)
      - 0-1 sentences → valid: true
      - 2+ sentences → valid: false

      Output 'message' in Korean explaining the result.`,
    },
    'gpt-4.1-mini': {
      instructions: `
      You must validate if the user input contains ONE sentence or less.

      IMPORTANT: A sentence is a complete thought or statement. Multiple sentences can exist even WITHOUT punctuation marks.

      Examples of MULTIPLE sentences (invalid):
      - "안녕하세요 반갑습니다" (Two greetings = two sentences)
      - "날씨가 좋네요 산책하고 싶어요" (Two separate thoughts)
      - "배가 고파. 밥 먹자" (Two sentences with/without punctuation)
      - "What is the weather? I want to go out" (Two questions/statements)

      Examples of ONE sentence (valid):
      - "안녕하세요" (One greeting)
      - "오늘 날씨가 정말 좋네요" (One complete thought)
      - "Can you help me with this task?" (One question)

      Validation rules:
      - 0 sentences (empty or only spaces) → valid: true, message: "입력이 비어있습니다"
      - 1 sentence → valid: true, message: "유효한 입력입니다"
      - 2+ sentences → valid: false, message: "한 문장만 입력해주세요. 여러 문장이 감지되었습니다"

      Look for:
      1. Punctuation marks (., !, ?, 。, ！, ？) indicating sentence boundaries
      2. Complete independent thoughts or statements that could stand alone
      3. Multiple commands, questions, or statements combined together

      Always output 'message' in Korean explaining the validation result clearly.`,
    },
  },
);

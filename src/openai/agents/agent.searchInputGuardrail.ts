import { getAgentCreator } from '@/openai/agent.utils';
import z from 'zod';

export const createAgentSearchInputGuardrail = getAgentCreator(
  {
    name: 'Search input guardrail',
    outputType: z.object({ valid: z.boolean(), message: z.string() }),
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
      Validate if input contains ONE sentence or less.

      Sentence endings: period (.), exclamation mark (!), question mark (?)
      - 0-1 sentences → valid: true
      - 2+ sentences → valid: false

      Output 'message' in Korean explaining the result.`,
    },
  },
);

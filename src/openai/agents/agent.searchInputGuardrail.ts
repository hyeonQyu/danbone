import { Agent } from '@openai/agents';
import z from 'zod';

export const searchInputGuardrail = new Agent({
  name: 'Search input guardrail',
  model: 'gpt-5-nano',
  instructions: `
    Validate if input contains ONE sentence or less.

    Sentence endings: period (.), exclamation mark (!), question mark (?)
    - 0-1 sentences → valid: true
    - 2+ sentences → valid: false

    Output 'message' in Korean explaining the result.`,
  outputType: z.object({ valid: z.boolean(), message: z.string() }),
});

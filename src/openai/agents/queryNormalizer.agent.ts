import { buildAgentFactory } from '@/openai/agent.utils';
import { LocalizedTextSchema } from '@/openai/schemes';

export const queryNormalizerAgentFactory = buildAgentFactory(
  {
    name: 'Query normalizer',
    outputType: LocalizedTextSchema,
  },
  [
    {
      id: 'gpt-5-nano',
      label: 'gpt-5-nano',
      model: 'gpt-5-nano',
      instructions: `
      Normalize the input text to standard form in the specified language.
      
      Input format: { "language": "<language_code>", "text": "..." }
      
      Tasks:
      1. Convert non-standard expressions to standard form (slang, colloquialisms, informal endings)
      2. Fix typos and spelling errors
      3. If text is written in wrong script, convert to the correct script matching the language field
         (e.g., Japanese word in Hangul → Japanese script, NOT translation)
      
      Output: { "language": "<same_language_code>", "text": "<normalized_text>" }`,
    },
  ] as const,
);

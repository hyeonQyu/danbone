import { buildAgentFactory } from '@/openai/agent.utils';
import { validatorSchema } from '@/openai/schemes';

export const inputValidatorAgentFactory = buildAgentFactory(
  {
    name: 'Input validator',
    outputType: validatorSchema,
  },
  {
    'gpt-5-nano': {
      instructions: `
      Validate if the input text is a valid word, phrase, sentence, or clause in the specified language.
      
      Input format: { "language": "<language_code>", "text": "..." }
      
      FUNDAMENTAL RULE: Language = MEANING, not SCRIPT
      The "language" field indicates what LANGUAGE the text should be in, NOT what script/characters to use.
      
      Examples:
      - language: "ja", text: "아리가또" (Japanese word in Hangul) → VALID
      - language: "ja", text: "ありがとう" (Japanese in Japanese script) → VALID
      - language: "en", text: "생큐" (English "thank you" in Hangul) → VALID
      - language: "ko", text: "아리가또" (Japanese word, not Korean) → INVALID
      
      Accept simple typos. Reject meaningless character combinations.
      
      Output: { "valid": true } or { "valid": false }`,
    },
  },
);

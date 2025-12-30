import { buildAgentFactory } from '@/openai/agent.utils';
import { TextSchema } from '@/openai/schemes';

const gpt41Instructions = `
Normalize non-standard text to standard form in the specified language.

Input format: { "language": "<language_code>", "text": "..." }

STEP-BY-STEP NORMALIZATION PROCESS:
1. Read the "language" field to identify the target language
2. Analyze the "text" field for normalization needs:
   - Typos and spelling errors
   - Slang, colloquialisms, and informal expressions
   - Wrong script (e.g., Japanese word written in Hangul → convert to Japanese script)
   - Informal endings or non-standard grammar
3. Apply corrections while preserving the original meaning
4. Return the normalized text

CRITICAL RULES:
- DO NOT translate - only normalize in the SAME language
- If wrong script is used, convert to correct script (e.g., "아리가또" → "ありがとう")
- Fix typos but keep the meaning identical
- Convert informal/slang to standard form

EXAMPLES:
✓ {"language": "ja", "text": "아리가또"} → { "text": "ありがとう" } (wrong script corrected)
✓ {"language": "ja", "text": "あざす"} → { "text": "ありがとう" } (slang normalized)
✓ {"language": "en", "text": "thnk u"} → { "text": "thank you" } (typos fixed)
✓ {"language": "en", "text": "생큐"} → { "text": "thank you" } (wrong script corrected)
✓ {"language": "ko", "text": "ㄱㅅ"} → { "text": "감사합니다" } (abbreviation expanded)
✓ {"language": "ko", "text": "고마웡"} → { "text": "고마워" } (typo fixed)

Output: { "text": "<normalized_text>" }`;

const gpt4oInstructions = `
Normalize non-standard text to standard form in the specified language.

Input: { "language": "<code>", "text": "..." }

Tasks:
1. Fix typos and spelling errors
2. Convert slang, colloquialisms, and informal expressions to standard form
3. Correct script if text is written in wrong script (e.g., Japanese in Hangul → Japanese script)
4. Standardize informal endings and non-standard grammar

Rules:
- Do NOT translate, only normalize in the same language
- Preserve original meaning

Examples:
- {"language": "ja", "text": "아리가또"} → { "text": "ありがとう" }
- {"language": "en", "text": "thnk u"} → { "text": "thank you" }
- {"language": "ko", "text": "ㄱㅅ"} → { "text": "감사합니다" }

Output: { "text": "<normalized_text>" }`;

const gpt5Instructions = `
Normalize input text to standard form.

Input: { "language": "<code>", "text": "..." }

Tasks:
1. Fix typos and spelling errors
2. Convert slang/colloquialisms to standard form
3. Correct script if written in wrong script

Output: { "text": "<normalized_text>" }`;

export const queryNormalizerAgentFactory = buildAgentFactory(
  {
    name: 'Query normalizer',
    outputType: TextSchema,
  },
  [
    {
      id: 'gpt-4.1-nano',
      label: 'GPT-4.1 Nano',
      model: 'gpt-4.1-nano',
      instructions: gpt41Instructions,
    },
    {
      id: 'gpt-4.1-mini',
      label: 'GPT-4.1 Mini',
      model: 'gpt-4.1-mini',
      instructions: gpt41Instructions,
    },
    {
      id: 'gpt-4o-mini',
      label: 'GPT-4o Mini',
      model: 'gpt-4o-mini',
      instructions: gpt41Instructions,
    },
    {
      id: 'gpt-4o',
      label: 'GPT-4o',
      model: 'gpt-4o',
      instructions: gpt4oInstructions,
    },
    {
      id: 'gpt5-nano-reasoning-low',
      label: 'GPT-5 Nano (reasoning: low)',
      model: 'gpt-5-nano',
      instructions: gpt5Instructions,
      modelSettings: {
        reasoning: { effort: 'low' },
      },
    },
  ] as const,
);

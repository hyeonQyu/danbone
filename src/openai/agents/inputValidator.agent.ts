import { buildAgentFactory } from '@/openai/agent.utils';
import { ValidatorSchema } from '@/openai/schemes';

const gpt5Instructions = `
Validate if input text is a real word/phrase in the specified language.

Input: { "language": "<code>", "text": "..." }

RULE: Validate MEANING, not script.

Valid if:
- Text is an actual word/phrase in the target language
- Script/characters don't matter

Invalid if:
- Text is from a different language
- Meaningless character combinations (e.g., "ぎゃらぷす", "カタガナバボ")

Examples:
✓ ja + "아리가또" → VALID (Japanese word in Hangul)
✗ ja + "안녕하세요" → INVALID (Korean word, not Japanese)
✗ ja + "ぎゃらぷす" → INVALID (Meaningless characters)

Output: { "valid": true/false }`;

const gpt41Instructions = `
Validate if the input text is a valid word, phrase, sentence, or clause in the specified language.

Input format: { "language": "<language_code>", "text": "..." }

CRITICAL RULE: Validate the MEANING and LANGUAGE, NOT the script/characters!
The text must be an actual word/phrase in the specified language, regardless of what script it's written in.

STEP-BY-STEP VALIDATION:
1. Read the "language" field - this is the target language
2. Analyze the "text" field - what language is this ACTUALLY in?
3. Ignore the script/characters used - focus only on the MEANING
4. If the text is a real word/phrase in the target language → VALID
5. If the text is from a different language OR meaningless → INVALID

VALID Examples (CORRECT cases):
✓ {"language": "ja", "text": "아리가또"} → VALID (Japanese word "ありがとう" written in Hangul)
✓ {"language": "ja", "text": "ありがとう"} → VALID (Japanese word in Japanese script)
✓ {"language": "ja", "text": "arigatou"} → VALID (Japanese word in romaji)
✓ {"language": "en", "text": "생큐"} → VALID (English "thank you" in Hangul)
✓ {"language": "en", "text": "thank you"} → VALID (English in Latin script)
✓ {"language": "ko", "text": "감사합니다"} → VALID (Korean word)

INVALID Examples (WRONG cases - MUST REJECT):
✗ {"language": "ja", "text": "안녕하세요"} → INVALID ("안녕하세요" is KOREAN, not Japanese!)
✗ {"language": "ja", "text": "ぎゃらぷす"} → INVALID (Meaningless Japanese characters, not a real word)
✗ {"language": "ja", "text": "カタガナバボ"} → INVALID (Random katakana, not a real Japanese word)
✗ {"language": "ko", "text": "아리가또"} → INVALID ("arigatou" is Japanese, not Korean)
✗ {"language": "ko", "text": "生큐"} → INVALID ("thank you" is English, not Korean)
✗ {"language": "en", "text": "asdfgh"} → INVALID (Meaningless character combination)

IMPORTANT DISTINCTIONS:
- "안녕하세요" (annyeonghaseyo) = Korean greeting → ONLY valid for language: "ko"
- "ありがとう" (arigatou) = Japanese thank you → ONLY valid for language: "ja"
- Script doesn't matter, but the ACTUAL LANGUAGE does!
- Random characters that look like a language but are meaningless → INVALID

Minor typos are OK (e.g., "thnk you"), but only if the word is clearly recognizable.

Output ONLY: { "valid": true } or { "valid": false }`;

export const inputValidatorAgentFactory = buildAgentFactory(
  {
    name: 'Input validator',
    outputType: ValidatorSchema,
  },
  [
    // GPT-5 Nano (5개)
    {
      id: 'gpt5-nano-reasoning-minimal',
      label: 'GPT-5 Nano (reasoning: minimal)',
      model: 'gpt-5-nano',
      instructions: gpt41Instructions,
      modelSettings: {
        reasoning: { effort: 'minimal' },
      },
    },
    {
      id: 'gpt5-nano-reasoning-low',
      label: 'GPT-5 Nano (reasoning: low)',
      model: 'gpt-5-nano',
      instructions: gpt41Instructions,
      modelSettings: {
        reasoning: { effort: 'low' },
      },
    },
    {
      id: 'gpt5-nano-reasoning-medium',
      label: 'GPT-5 Nano (reasoning: medium)',
      model: 'gpt-5-nano',
      instructions: gpt5Instructions,
      modelSettings: {
        reasoning: { effort: 'medium' },
      },
    },
    {
      id: 'gpt5-nano-reasoning-high',
      label: 'GPT-5 Nano (reasoning: high)',
      model: 'gpt-5-nano',
      instructions: gpt5Instructions,
      modelSettings: {
        reasoning: { effort: 'high' },
      },
    },

    // GPT-5 Mini (4개)
    {
      id: 'gpt5-mini-reasoning-low',
      label: 'GPT-5 Mini (reasoning: low)',
      model: 'gpt-5-mini',
      instructions: gpt5Instructions,
      modelSettings: {
        reasoning: { effort: 'low' },
      },
    },
    {
      id: 'gpt5-mini-reasoning-medium',
      label: 'GPT-5 Mini (reasoning: medium)',
      model: 'gpt-5-mini',
      instructions: gpt5Instructions,
      modelSettings: {
        reasoning: { effort: 'medium' },
      },
    },
    {
      id: 'gpt5-mini-reasoning-high',
      label: 'GPT-5 Mini (reasoning: high)',
      model: 'gpt-5-mini',
      instructions: gpt5Instructions,
      modelSettings: {
        reasoning: { effort: 'high' },
      },
    },
    {
      id: 'gpt5-mini-no-reasoning',
      label: 'GPT-5 Mini (no reasoning)',
      model: 'gpt-5-mini',
      instructions: gpt5Instructions,
    },

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
  ] as const,
);

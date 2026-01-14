import { buildAgentFactory } from '@/openai/agent.utils';
import { TextsSchema } from '@/openai/schemes';

const simpleInstructions = `
Translate JMdict English glosses to target language.

Input: { "sourceLanguage": "<code>", "kanjis": ["..."], "kanas": ["..."], "glosses": [{ "text": "..." }, ...] }

Tasks:
1. Understand the Japanese word (kanji/kana)
2. Each English gloss shows a different meaning/nuance
3. Translate each gloss distinctly - avoid duplicates
4. Return array of translations, one per gloss

CRITICAL: Make each translation different from the others

Rules:
- Japanese word is the source
- Each gloss = different nuance = different translation
- Return array with same length as glosses

Output: { "texts": ["translation1", "translation2", ...] }`;

export const jmdictTranslatorAgentFactory = buildAgentFactory(
  {
    name: 'JMdict Translator',
    outputType: TextsSchema,
  },
  [
    {
      id: 'gpt-5-mini-low',
      label: 'GPT-5 Mini (low)',
      model: 'gpt-5-mini',
      instructions: simpleInstructions,
      modelSettings: {
        reasoning: { effort: 'low' },
      },
    },
    {
      id: 'gpt-5-mini',
      label: 'GPT-5 Mini',
      model: 'gpt-5-mini',
      instructions: simpleInstructions,
    },
    {
      id: 'gpt-5-nano-low',
      label: 'GPT-5 Nano (low)',
      model: 'gpt-5-nano',
      instructions: simpleInstructions,
      modelSettings: {
        reasoning: { effort: 'low' },
      },
    },
    {
      id: 'gpt-4o-mini',
      label: 'GPT-4o Mini',
      model: 'gpt-4o-mini',
      instructions: simpleInstructions,
    },
    {
      id: 'gpt-4.1-mini',
      label: 'GPT-4.1 Mini',
      model: 'gpt-4.1-mini',
      instructions: simpleInstructions,
    },
  ] as const,
);

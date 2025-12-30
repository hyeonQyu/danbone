import { buildAgentFactory } from '@/openai/agent.utils';
import { DictionaryOutputSchemaByLanguage } from '@/openai/schemes';

const commonInstructions = `
Provide detailed dictionary information for Japanese words with rich explanations and context.

Input format: { "sourceLanguage": "<language>", "words": ["word1", "word2", ...] }

Detailed Rules:
1. notation: Write in standard form
   - Kanji for Chinese-origin words (食べる, 広い, 切る)
   - Hiragana for native words (ひらがな)
   - Katakana for loanwords (カフェ, コーヒー)

2. pronunciation: Always in hiragana (たべる, ひろい, きる)

 3. meanings: Provide 1-3 meanings in the sourceLanguage
    - This is a WORD DICTIONARY, not an encyclopedia - provide dictionary-level meanings only
    - For basic/obvious words: just the meaning without explanation (e.g., "먹다", "자다", "고양이")
    - Add brief context ONLY when needed for clarity or nuance:
      * For words with multiple contexts: "넓다"
      * For figurative/extended meanings: "切る; (물건을) 자르다 / (전화·전원을) 끊다"
    - Don't add encyclopedic descriptions (NO: "고양이; 포유류 동물로...", YES: "고양이")
    - If same POS has COMPLETELY different meanings, separate into different entries within that word
    - If meanings are similar/related variations, keep in one entry as an array

4. pos: Choose from: godanVerb, ichidanVerb, irregularVerb, noun, naAdjective, iAdjective, adverb, preposition, conjunction, interjection

5. examples: 1-2 natural, commonly used sentences in Japanese that clearly demonstrate the meaning

6. If a word has multiple parts of speech, create separate entries for each POS with appropriate explanations

IMPORTANT: 
- This is a WORD DICTIONARY, not an encyclopedia
- Most words need NO explanation (e.g., 먹다, 자다, 고양이, 개, 달리다)
- Add brief context ONLY for words with nuance/ambiguity (e.g., 넓다; 범위가 큰, 切る; 끊다)
- Keep meanings at dictionary-level, not encyclopedic descriptions

Process ALL words in the input array and return results for each in the words array.`;

export const jaDictionaryAgentFactory = buildAgentFactory(
  {
    name: 'Japanese Dictionary',
    outputType: DictionaryOutputSchemaByLanguage.ja,
  },
  [
    {
      id: 'gpt-5-mini',
      label: 'gpt-5-mini',
      model: 'gpt-5-mini',
      instructions: commonInstructions,
      modelSettings: {
        reasoning: {
          effort: 'minimal',
        },
      },
    },
    {
      id: 'gpt-5-nano',
      label: 'gpt-5-nano',
      model: 'gpt-5-nano',
      instructions: commonInstructions,
      modelSettings: {
        reasoning: {
          effort: 'low',
        },
      },
    },
    {
      id: 'gpt-4.1-mini',
      label: 'gpt-4.1-mini',
      model: 'gpt-4.1-mini',
      instructions: commonInstructions,
    },
    {
      id: 'gpt-4.1-nano',
      label: 'gpt-4.1-nano',
      model: 'gpt-4.1-nano',
      instructions: commonInstructions,
    },
  ] as const,
);

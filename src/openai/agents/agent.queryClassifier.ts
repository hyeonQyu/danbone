import { getAgentCreator } from '@/openai/agent.utils';
import { queryClassifierOutputSchema } from '@/openai/schemes';

export const createAgentQueryClassifier = getAgentCreator(
  {
    name: 'Query classifier',
    outputType: queryClassifierOutputSchema,
  },
  {
    'gpt-4.1-nano': {
      instructions: `
    Classify the input query based on two criteria:

    1. Unit Type:
       - "word": Single word or short phrase without sentence structure
       - "sentence": Complete sentence or clause with subject-predicate structure

    2. Language Type:
       - "ko": Korean text (순수 한국어)
       - "ja": Japanese text using Japanese characters (ひらがな, カタカナ, 漢字)
       - "ja_kor_input": Japanese words written in Korean characters (한글로 적은 일본어)
         Examples: "오마카세" (omakase), "스시" (sushi), "라멘" (ramen), "아나타가 스키다" (あなたが好き)

    3. Text Normalization:
       - Trim whitespace and normalize spacing
       - Fix typos and spelling errors
       - Language-specific conversion:
         * "ko": Keep as Korean
         * "ja": Keep as Japanese (fix any incorrect characters)
         * "ja_kor_input": Convert to proper Japanese (漢字 + ひらがな/カタカナ)
       - Examples:
         * "오마카세" → "おまかせ" or "お任せ"
         * "아나타가 스키다" → "あなたが好き" or "貴方が好き"
         * "라멘" → "ラーメン"

    Analyze the input carefully to determine:
    - Does it have sentence structure (subject + predicate) or is it just a word/phrase?
    - Is it written in Korean, Japanese characters, or Japanese pronunciation in Korean?
    - Are there any typos that need correction?`,
    },
  },
);

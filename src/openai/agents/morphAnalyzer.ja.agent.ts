import { buildAgentFactory } from '@/openai/agent.utils';
import { MorphAnalysisResultSchemeByLanguageSchema } from '@/openai/schemes';

export const jaMorphAnalyzerAgentFactory = buildAgentFactory(
  {
    name: 'Japanese morphological analyzer',
    outputType: MorphAnalysisResultSchemeByLanguageSchema['ja'],
  },
  {
    'gpt-5-mini': {
      instructions: `
      Analyze Japanese text and extract morphemes with their base forms and parts of speech.
      
      Input: Japanese text
      
      Output: { "tokens": [{ "surface": "<as written>", "base": "<dictionary form>", "pos": "<type>" }] }
      
      POS types: godanVerb, ichidanVerb, irregularVerb, noun, naAdjective, iAdjective, adverb, preposition, conjunction, interjection
      
      Important rules:
      - If a noun is used adverbially (e.g., 昨日, 明日, 毎日), classify it as noun, not adverb
      - Exclude punctuation marks (?, !, ., 。, ？, ！, etc.) from the tokens
      
      - surface: exact form in input
      - base: dictionary form (食べた→食べる, 高かった→高い)
      - pos: appropriate type from list`,
    },
  },
);

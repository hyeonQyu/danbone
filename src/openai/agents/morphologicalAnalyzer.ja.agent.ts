import { buildAgentFactory } from '@/openai/agent.utils';
import { MorphologicalAnalysisResultSchema } from '@/openai/schemes';

export const jaMorphologicalAnalyzerAgentFactory = buildAgentFactory(
  {
    name: 'Japanese morphological analyzer',
    outputType: MorphologicalAnalysisResultSchema,
  },
  [
    {
      id: 'gpt-5-mini',
      label: 'gpt-5-mini',
      model: 'gpt-5-mini',
      instructions: `
      Analyze Japanese text and extract morphemes with their base forms.
      
      Input: Japanese text
      
      Output: { "tokens": [{ "surface": "<as written>", "base": "<dictionary form>" }] }
      
      Important rules:
      - Exclude punctuation marks (?, !, ., 。, ？, ！, etc.) from the tokens
      - surface: exact form in input
      - base: dictionary form (食べた→食べる, 高かった→高い, 歩きます→歩く)`,
    },
  ] as const,
);

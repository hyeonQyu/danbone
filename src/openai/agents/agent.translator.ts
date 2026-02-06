import { buildAgentFactory } from '@/openai/agent.utils';
import { localizedTextsSchema } from '@/openai/schemes';

export const translatorAgentFactory = buildAgentFactory(
  {
    name: 'Translator',
    outputType: localizedTextsSchema,
  },
  {
    'gpt-5-mini': {
      instructions: `
      Translate text from source language to target language naturally.
      
      Input: { "text": "...", "sourceLanguage": "...", "targetLanguage": "..." }
      
      Tasks:
      1. Detect the formality level of the input text (casual/informal vs polite/formal)
      2. Translate ONLY to the SAME formality level in target language
         - If input is casual → provide only casual translations
         - If input is polite → provide only polite translations
      3. Provide multiple translations only when they differ in meaning, not formality
      4. Preserve the original meaning and nuance
      5. Exclude uncommon or rarely-used expressions
      6. Limits: words ≤5 variations, phrases/sentences ≤3 variations
      
      Output: { "language": "<targetLanguage>", "texts": ["translation1", "translation2", ...] }`,
    },
    'gpt-5-nano': {
      instructions: `
      Translate text from source language to target language naturally.
      
      Input: { "text": "...", "sourceLanguage": "...", "targetLanguage": "..." }
      
      Tasks:
      1. Detect the formality level of the input text (casual/informal vs polite/formal)
      2. Translate ONLY to the SAME formality level in target language
         - If input is casual → provide only casual translations
         - If input is polite → provide only polite translations
      3. Provide multiple translations only when they differ in meaning, not formality
      4. Preserve the original meaning and nuance
      5. Exclude uncommon or rarely-used expressions
      6. Limits: words ≤5 variations, phrases/sentences ≤3 variations
      
      Output: { "language": "<targetLanguage>", "texts": ["translation1", "translation2", ...] }`,
    },
  },
);
